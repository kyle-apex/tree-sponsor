import { Button } from '@mui/material';
import { signIn } from 'next-auth/client';
import React from 'react';
import { Stripe, stripe } from 'utils/stripe/init';

const SignupSuccess = ({ name }: { name: string }) => {
  return (
    <div>
      {name}
      <Button
        onClick={() => {
          signIn('email', { email: 'kyle@kylehoskins.com', redirect: false });
        }}
      >
        Sign in
      </Button>
    </div>
  );
};

export default SignupSuccess;

export async function getServerSideProps(context: any) {
  const { req } = context;

  const props: { name?: string } = {};

  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log('session', session);
    const customer = (await stripe.customers.retrieve(session.customer as string)) as Stripe.Customer;

    props.name = customer.name;
    console.log('customer', customer);
  } catch (err: unknown) {
    props.name = null;
  }

  return {
    props: props,
  };
}
