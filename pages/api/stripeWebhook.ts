import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Stripe, stripe } from 'utils/stripe/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: unknown) {
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : ''}`);
      return;
    }
    let email;
    console.log('stripe event', event);
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted' ||
      event.type === 'customer.subscription.created'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const result = await stripe.customers.retrieve(customerId);

      const customer = (result.object as unknown) as Stripe.Customer;
      email = customer.email;
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      email = invoice.customer_email;
    }

    console.log('stripe email', email);

    await updateSubscriptionsForUser(email);

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
export default cors(webhookHandler as any);
