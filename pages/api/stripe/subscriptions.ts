import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import stripe from 'utils/stripe/init';
import { getSession } from 'next-auth/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 50,
    email: session?.user?.email ?? '',
    expand: ['data.subscriptions'],
  });
  console.log('customers', customers);

  const subscriptions: Stripe.Subscription[] = [];

  customers.data.forEach((customer: Stripe.Customer) => {
    if (customer?.subscriptions) subscriptions.push(...customer.subscriptions.data);
  });

  console.log('subscriptions', subscriptions);

  //const portalSession = await createPortalSessionForEmail(session?.user?.email ?? '');
  res.status(200).json(subscriptions);
}
