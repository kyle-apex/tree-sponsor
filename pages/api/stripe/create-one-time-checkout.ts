import { NextApiRequest, NextApiResponse } from 'next';
import { findCustomer } from 'utils/stripe/find-customer';
import { getSession } from 'utils/auth/get-session';
import { stripe } from 'utils/stripe/init';
import { getURL } from 'utils/get-application-url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    const { amount, metadata = {}, cancelRedirectPath, returnUrl = '/' } = req.body;
    const userEmail = metadata.userEmail;

    // Validate amount
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: { statusCode: 400, message: 'Invalid amount' } });
    }

    try {
      const user = session ? session.user : null;
      let customerId: string;

      if (user?.email) customerId = user?.stripeCustomerId ? user.stripeCustomerId : await findCustomer(user.email as string);

      // Create a Stripe checkout session for one-time payment
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        customer: customerId,
        customer_email: !customerId && userEmail ? userEmail : undefined,
        allow_promotion_codes: true,
        submit_type: 'donate', // Change button text from "Pay" to "Donate"
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation',
                description: `$${parsedAmount} donation`,
              },
              unit_amount: parsedAmount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // One-time payment
        metadata: {
          ...metadata,
          returnUrl, // returnUrl is now always defined with a default value
        },
        success_url: `${getURL()}/donation-success?session_id={CHECKOUT_SESSION_ID}&returnUrl=${encodeURIComponent(returnUrl)}`,
        cancel_url: cancelRedirectPath ? getURL() + cancelRedirectPath : returnUrl,
      });

      return res.status(200).json({ sessionId: stripeSession.id });
    } catch (err: unknown) {
      console.log(err);
      res.status(500).json({ error: { statusCode: 500, message: (err as Error).message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
