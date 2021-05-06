import { Stripe, stripe } from './init';

export const findOrCreateCustomer = async (email: string) => {
  const existingCustomers = await stripe.customers.list({ email: email });

  const customer = await stripe.customers.create({ email: email });

  return customer.id;
};
