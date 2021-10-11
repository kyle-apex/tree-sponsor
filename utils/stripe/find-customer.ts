import { Stripe, stripe } from './init';

export const findCustomer = async (email: string): Promise<string> => {
  const existingCustomers = await stripe.customers.list({ email: email });

  if (existingCustomers.data?.length > 0) return existingCustomers.data[0].id;
};
