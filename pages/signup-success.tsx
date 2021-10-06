import { Box, Button, Container } from '@mui/material';
import Layout from 'components/layout/Layout';
import { signIn } from 'next-auth/client';
import React, { useEffect } from 'react';
import { Stripe, stripe } from 'utils/stripe/init';
import Image from 'next/image';
import LogoMessage from 'components/layout/LogoMessage';
import SponsorshipAddForm from 'components/sponsor/SponsorshipAddForm';

const SignupSuccess = ({ name, email }: { name?: string; email?: string }) => {
  useEffect(() => {
    if (email) signIn('email', { email: email, redirect: false });
  }, []);
  return (
    <Layout>
      <LogoMessage>
        <SponsorshipAddForm></SponsorshipAddForm>
        {!email && (
          <div className='center'>
            <p>Error!</p>
          </div>
        )}
        {email && (
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
      </LogoMessage>
    </Layout>
  );
};

export default SignupSuccess;

export async function getServerSideProps(context: any) {
  const { req } = context;

  const props: { name?: string; email?: string } = {};

  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log('session', session);
    const customer = (await stripe.customers.retrieve(session.customer as string)) as Stripe.Customer;

    props.name = customer.name;
    props.email = customer.email;
    console.log('customer', customer);
  } catch (err: unknown) {
    props.name = null;
  }

  return {
    props: props,
  };
}
