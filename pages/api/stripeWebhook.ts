import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Stripe, stripe } from 'utils/stripe/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
import { handleNewSubscription } from 'utils/stripe/handle-new-subscription';
import { handleRenewalPayment } from 'utils/stripe/handle-renewal-payment';

const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

const isMembershipProduct = (name: string): boolean =>
  name.includes('TFYP') || name.includes('Young Profess') || name.includes('Membership');

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
    console.log(`[webhook] Received event: ${event.type}`);
    let email: string;
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted' ||
      event.type === 'customer.subscription.created'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
      email = customer.email;
      console.log(`[webhook] ${event.type} for customer: ${email} (${customerId}), subscription: ${subscription.id}`);

      if (event.type === 'customer.subscription.created') {
        const productId = subscription.items.data[0]?.price.product as string;
        const product = await stripe.products.retrieve(productId);
        console.log(
          `[webhook] New subscription product: "${product.name}" (${productId}), isMembership: ${isMembershipProduct(product.name)}`,
        );
        if (isMembershipProduct(product.name)) {
          await handleNewSubscription(customer, subscription);
        } else {
          console.log(`[webhook] Skipping new subscription for non-membership product: ${product.name} (${productId})`);
        }
      } else if (event.type === 'customer.subscription.updated' && subscription.latest_invoice) {
        const invoiceId = subscription.latest_invoice as string;
        const invoice = await stripe.invoices.retrieve(invoiceId);
        console.log(
          `[webhook] customer.subscription.updated latest_invoice: ${invoiceId}, status: ${invoice.status}, billing_reason: ${invoice.billing_reason}`,
        );
        if (invoice.status === 'paid' && invoice.billing_reason === 'subscription_cycle') {
          const productId = subscription.items.data[0]?.price.product as string;
          const product = await stripe.products.retrieve(productId);
          console.log(
            `[webhook] Renewal via subscription.updated — product: "${product.name}" (${productId}), isMembership: ${isMembershipProduct(
              product.name,
            )}`,
          );
          if (isMembershipProduct(product.name)) {
            await handleRenewalPayment(email);
          } else {
            console.log(`[webhook] Skipping renewal — non-membership product: ${product.name} (${productId})`);
          }
        } else {
          console.log(`[webhook] Skipping customer.subscription.updated — not a paid renewal cycle`);
        }
      }
    } else if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice;
      email = invoice.customer_email;
      console.log(`[webhook] invoice.paid for: ${email}, billing_reason: ${invoice.billing_reason}`);
      if (invoice.billing_reason === 'subscription_cycle') {
        const lineProductIds = invoice.lines.data.map(l => l.price?.product as string).filter(Boolean);
        console.log(`[webhook] Renewal invoice has ${invoice.lines.data.length} line item(s), productIds: [${lineProductIds.join(', ')}]`);
        const lineProducts = await Promise.all(lineProductIds.map(id => stripe.products.retrieve(id)));
        const membershipProduct = lineProducts.find(p => isMembershipProduct(p.name));
        console.log(
          `[webhook] Renewal products checked: ${lineProducts.map(p => `"${p.name}" (${p.id})`).join(', ')}; membership match: ${
            membershipProduct ? `"${membershipProduct.name}"` : 'none'
          }`,
        );
        if (membershipProduct) {
          await handleRenewalPayment(email);
        } else {
          console.log(`[webhook] Skipping renewal — no membership product found among line items`);
        }
      }
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      email = invoice.customer_email;
      console.log(`[webhook] invoice.payment_failed for: ${email}`);
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
