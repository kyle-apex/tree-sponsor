import { Box, Button, Container } from '@mui/material';
import Layout from 'components/layout/Layout';
import { signIn, getSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import { Stripe, stripe } from 'utils/stripe/init';

import Image from 'next/image';
import LogoMessage from 'components/layout/LogoMessage';
import Link from 'next/link';
import { getURL } from 'utils/get-application-url';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

import { prisma } from 'utils/prisma/init';

const SignupSuccess = ({ name, email, isSignedIn }: { name?: string; email?: string; isSignedIn: boolean }) => {
  useEffect(() => {
    if (email && !isSignedIn) signIn('email', { email: email, redirect: false, callbackUrl: window.origin + '/account' });
    console.log('name', name);
  }, []);
  return (
    <Layout>
      <LogoMessage>
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
            <p>You can manage your sponsored trees in your account:</p>
            <Link href='/account'>
              <Button fullWidth variant='outlined' color='primary'>
                View My Account
              </Button>
            </Link>
          </div>
        )}
      </LogoMessage>
    </Layout>
  );
};

export default SignupSuccess;

export async function getServerSideProps(context: any) {
  const { req } = context;

  const session = await getSession(context);

  const props: { name?: string; email?: string; isSignedIn?: boolean } = {};

  props.isSignedIn = !!session?.user;

  let email = session?.user?.email;

  const stripeSessionId = req.query.session_id;
  delete req.query.session_id;

  if (!props.isSignedIn) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
      console.log('session', stripeSession);
      const customer = (await stripe.customers.retrieve(stripeSession.customer as string)) as Stripe.Customer;

      email = customer.email;

      props.name = customer.name;
      props.email = email;

      await prisma.user.upsert({
        where: { email: customer.email },
        create: { name: customer.name, email, stripeCustomerId: customer.id },
        update: { name: customer.name },
      });

      console.log('customer', customer);
    } catch (err: unknown) {
      props.name = null;
    }
  }

  if (stripeSessionId && email) {
    updateSubscriptionsForUser(email);
  }

  return {
    props: props,
  };
}
