import React from 'react';
import { Stripe, stripe } from 'utils/stripe/init';

const SignupSuccess = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};

export default SignupSuccess;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log('session', session);
  const customer = (await stripe.customers.retrieve(session.customer as string)) as Stripe.Customer;
  console.log('customer', customer);

  return {
    props: {
      name: customer.name,
    },
  };
}
