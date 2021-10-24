import { stripe } from './init';

export const findOrCreateCustomer = async (email: string): Promise<string> => {
  const existingCustomers = await stripe.customers.list({ email: email });
  console.log('existing customers', existingCustomers);

  if (existingCustomers.data?.length > 0) return existingCustomers.data[0].id;

  const customer = await stripe.customers.create({ email: email });

  return customer.id;
};
