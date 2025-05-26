import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from 'components/layout/Layout';
import { signIn, getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { Stripe, stripe } from 'utils/stripe/init';

import LogoMessage from 'components/layout/LogoMessage';
import Link from 'next/link';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

import { prisma } from 'utils/prisma/init';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import { useRouter } from 'next/router';

const SignupSuccess = ({
  name,
  email,
  isSignedIn,
  returnUrl,
}: {
  name?: string;
  email?: string;
  isSignedIn: boolean;
  returnUrl?: string;
}) => {
  const router = useRouter();
  useEffect(() => {
    if (email && !isSignedIn) {
      signIn('email', { email: email, redirect: false, callbackUrl: window.origin + '/account' });
    }

    // If returnUrl is provided, redirect back to that page
    if (returnUrl) {
      router.push(returnUrl);
    }
  }, [email, isSignedIn, returnUrl, router]);
  return (
    <Layout title='Sign In'>
      <LogoMessage>
        {returnUrl ? (
          <div className='center'>
            <h2>Thanks for your donation!</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress color='primary' />
            </div>
          </div>
        ) : (
          <>
            {!email && !isSignedIn && (
              <div className='center'>
                <p>Sorry, an error has occurred.</p>
              </div>
            )}
            {email && !isSignedIn && (
              <div className='center'>
                <h2>Thanks for your donation!</h2>
                <p>
                  A login link to get started with your account was sent to your email address: <b>{email || ''}</b>
                </p>
                <p>or</p>
                <Link href='/signin'>
                  <Button fullWidth variant='outlined' color='primary'>
                    Sign in With Google/Facebook
                  </Button>
                </Link>
              </div>
            )}
            {isSignedIn && (
              <div className='center'>
                <h2>Thanks for your donation!</h2>
                <p>View your membership benefits in your account:</p>
                <Link href='/account'>
                  <Button fullWidth variant='outlined' color='primary'>
                    View My Account
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </LogoMessage>
    </Layout>
  );
};

export default SignupSuccess;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  const queryObj = query;

  const session = await getSession(context);

  const props: { name?: string; email?: string; isSignedIn?: boolean; returnUrl?: string } = {};

  props.isSignedIn = !!session?.user;

  let email = session?.user?.email;

  let stripeSessionId;
  let returnUrl;
  if (queryObj) {
    stripeSessionId = queryObj.session_id as string;
    returnUrl = queryObj.returnUrl as string;
    delete queryObj.session_id;
    delete queryObj.returnUrl;
  }

  props.returnUrl = returnUrl;

  console.log('stripeSessionId', stripeSessionId);

  if (!props.isSignedIn && stripeSessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
      console.log('session', stripeSession);
      const customer = (await stripe.customers.retrieve(stripeSession.customer as string)) as Stripe.Customer;
      console.log('customer', customer);

      if (customer?.metadata && stripeSession?.metadata) {
        Object.assign(customer.metadata, stripeSession.metadata);
        stripe.customers.update(customer.id, { metadata: customer.metadata });
      }

      // Store donation data in StripeDonation table
      if (stripeSession.payment_status === 'paid') {
        const metadata = stripeSession.metadata || {};
        // Use $executeRaw to bypass TypeScript error until Prisma client is regenerated
        await prisma.$executeRaw`
          INSERT INTO StripeDonation (
            stripeSessionId,
            stripeCustomerId,
            amount,
            status,
            eventId,
            eventName,
            userId,
            metadata,
            createdDate
          ) VALUES (
            ${stripeSession.id},
            ${customer.id},
            ${stripeSession.amount_total / 100},
            ${stripeSession.payment_status},
            ${metadata.eventId ? parseInt(metadata.eventId) : null},
            ${metadata.eventName || null},
            ${metadata.userId ? parseInt(metadata.userId) : null},
            ${JSON.stringify(metadata)},
            NOW()
          )
        `;
      }

      email = customer.email;

      let firstName: string;
      let lastName: string;

      if (customer?.name) {
        const customerNameSplit = customer.name.split(' ');
        firstName = customerNameSplit.shift()?.trim();
        lastName = customerNameSplit.join(' ')?.trim();
      }

      if (stripeSession?.metadata?.['Email Subscribe'] == 'Yes')
        addSubscriber(email, { FNAME: firstName, LNAME: lastName, AMOUNT: stripeSession.amount_total / 100 + '' });

      props.name = customer.name;
      props.email = email;

      // TODO email2
      const prismaUser = await prisma.user.upsert({
        where: { email: customer.email },
        create: { name: customer.name, email, stripeCustomerId: customer.id },
        update: { name: customer.name },
      });

      if (!prismaUser.profilePath) {
        prisma.user.update({ where: { id: prismaUser.id }, data: { profilePath: generateProfilePath(prismaUser) } });
      }

      console.log('customer', customer);
    } catch (err: unknown) {
      props.name = null;
      console.log('err', err);
    }
  }

  if (stripeSessionId && email) {
    updateSubscriptionsForUser(email);
  }

  return {
    props: props,
  };
}
