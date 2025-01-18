import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Stripe, stripe } from 'utils/stripe/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';

const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = `Webhook Error: ${err instanceof Error ? err.message : ''}`;
      console.log(errorMessage);
      res.status(400).send(errorMessage);
      return;
    }
    let email: string;
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted' ||
      event.type === 'customer.subscription.created'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
      //const customer = result ;
      email = customer.email;
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      email = invoice.customer_email;
    }

    console.log('received webhook for email: ', email);

    await updateSubscriptionsForUser(email);

    setTimeout(() => {
      updateSubscriptionsForUser(email);
    }, 60000);

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
export default cors(webhookHandler as any);
