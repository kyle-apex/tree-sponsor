import { NextApiRequest, NextApiResponse } from 'next';
import { findOrCreateCustomer } from 'utils/stripe/find-or-create-customer';
import { getSession } from 'utils/auth/get-session';
import { Stripe, stripe } from 'utils/stripe/init';
import { getURL } from 'utils/get-application-url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    console.log('session', session);

    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const user = session ? session.user : null;
      let customerId: string;

      if (user?.email) customerId = user?.stripeCustomerId ? user.stripeCustomerId : await findOrCreateCustomer(user.email as string);

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        customer: customerId,
        allow_promotion_codes: false,
        line_items: [
          {
            price,
            quantity,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          trial_from_plan: true,
          metadata,
        },
        success_url: `${getURL()}/account`,
        cancel_url: `${getURL()}/`,
      });

      return res.status(200).json({ sessionId: stripeSession.id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
