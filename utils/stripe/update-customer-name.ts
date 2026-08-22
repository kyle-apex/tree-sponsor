import { stripe } from './init';

const updateCustomerName = async (customerId: string, firstName: string, lastName: string): Promise<void> => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (!fullName) {
    console.log('[update-customer-name] Skipping — no name in metadata');
    return;
  }
  try {
    await stripe.customers.update(customerId, { name: fullName });
    console.log(`[update-customer-name] Updated Stripe customer name to "${fullName}"`);
  } catch (err) {
    console.error('Error updating Stripe customer name:', err);
  }
};

export default updateCustomerName;
