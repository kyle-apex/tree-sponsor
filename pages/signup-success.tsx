import { Box, Button, Container } from '@mui/material';
import Layout from 'components/layout/Layout';
import { signIn, getSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import { Stripe, stripe } from 'utils/stripe/init';

import Image from 'next/image';
import LogoMessage from 'components/layout/LogoMessage';
import SponsorshipAddForm from 'components/sponsor/SponsorshipAddForm';
import Link from 'next/link';

const SignupSuccess = ({ name, email, isSignedIn }: { name?: string; email?: string; isSignedIn: boolean }) => {
  useEffect(() => {
    if (email) signIn('email', { email: email, redirect: false });
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
            <p>A login link to get started with your account was sent to your email address: {email || ''}</p>
            {false && (
              <Button fullWidth variant='outlined' color='primary'>
                Retry Login
              </Button>
            )}
          </div>
        )}
        {isSignedIn && (
          <div className='center'>
            <h2>Thanks for your donation!</h2>
            <p>You can manager your sponsored trees in your account:</p>
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

  if (!props.isSignedIn) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(req.query.session_id);
      console.log('session', stripeSession);
      const customer = (await stripe.customers.retrieve(stripeSession.customer as string)) as Stripe.Customer;

      props.name = customer.name;
      props.email = customer.email;
      console.log('customer', customer);
    } catch (err: unknown) {
      props.name = null;
    }
  }

  return {
    props: props,
  };
}
