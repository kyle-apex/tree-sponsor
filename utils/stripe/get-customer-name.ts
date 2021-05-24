import Stripe from 'stripe';

export const getCustomerName = (customer: Stripe.Customer): string => {
  return customer.metadata && customer.metadata['Name (First)']
    ? customer.metadata['Name (First)'] + ' ' + customer.metadata['Name (Last)']
    : customer.name;
};
