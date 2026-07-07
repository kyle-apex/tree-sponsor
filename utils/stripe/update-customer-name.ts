import { stripe } from './init';

const updateCustomerName = async (customerId: string, firstName: string, lastName: string): Promise<void> => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (!fullName) return;
  try {
    await stripe.customers.update(customerId, { name: fullName });
  } catch (err) {
    console.error('Error updating Stripe customer name:', err);
  }
};

export default updateCustomerName;
