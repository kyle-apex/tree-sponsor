import { Stripe, stripe } from './init';

const createPortalSessionForEmail = async function (email: string): Promise<Stripe.BillingPortal.Session | undefined> {
  if (!email) return;

  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 5,
    email: email,
    expand: ['subscriptions'],
  });

  console.log('customers', customers);
  customers.data.forEach((customer: Stripe.Customer) => {
    console.log('subs1', customer.subscriptions);
  });

  const session: Stripe.BillingPortal.Session = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: 'https://example.com/account',
  });
  console.log('session', session);
  return session;
};

export default createPortalSessionForEmail;
