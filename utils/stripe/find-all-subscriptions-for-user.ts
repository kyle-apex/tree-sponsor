import { PartialSubscription, StripeSubscription } from 'interfaces';
import { getCustomerName } from './get-customer-name';
import { getLastPaymentDateForSubscription } from './get-last-payment-date-for-subscription';
import { Stripe, stripe } from './init';
import getProductIdToNameMap from './get-product-id-to-name-map';
import { prisma } from 'utils/prisma/init';
import { SubscriptionStatusDetails } from '@prisma/client';

export const findAllSubscriptionsForUser = async (email: string): Promise<PartialSubscription[]> => {
  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 150,
    email: email,
  });

  const subscriptions: PartialSubscription[] = [];
  const productIds: string[] = [];

  await Promise.all(
    customers.data.map(async (customer: Stripe.Customer) => {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        expand: ['data.latest_invoice.payment_intent'],
      });

      const customerSubscriptions = subs?.data;

      // canceledSubs.data[0].latest_invoice.

      /*if (canceledSubs?.data?.length > 0 && customer?.subscriptions) {
        if (!customer?.subscriptions.data) customer.subscriptions.data = [];
        customer.subscriptions.data = customer.subscriptions.data.concat(canceledSubs?.data);
      }*/

      if (customerSubscriptions?.length) {
        await Promise.all(
          customerSubscriptions.map(async (sub: StripeSubscription) => {
            const productId = sub.plan.product;

            const customerName: string = getCustomerName(customer);
            const lastPaymentDate: Date = await getLastPaymentDateForSubscription(sub);

            let statusDetails;
            let cancellationDetails;

            const latest_invoice = sub?.latest_invoice;
            if (latest_invoice && typeof latest_invoice != 'string') {
              const payment_intent = latest_invoice.payment_intent;
              if (payment_intent && typeof payment_intent != 'string' && payment_intent.last_payment_error?.code == 'card_declined') {
                statusDetails = SubscriptionStatusDetails.Payment_Failed;
                cancellationDetails = payment_intent.last_payment_error.decline_code;
              }
            }
            if (!statusDetails && (sub.cancel_at || sub.canceled_at)) {
              sub.status = 'canceled';
              statusDetails = SubscriptionStatusDetails.Cancelled_Manually;
            }
            // sub.latest_invoice.payment_intent.last_payment_error.code == 'card_declined',
            // .latest_invoice.payment_intent.last_payment_error.decline_code == 'stolen_card'

            const subscription: PartialSubscription = {
              product: { stripeId: productId, amount: Math.round(sub.plan.amount / 100) },
              stripeId: sub.id,
              stripeCustomerId: sub.customer as string,
              user: { email: customer.email, name: customerName },
              status: sub.status,
              statusDetails, // Payment Failed, Manually Canceled
              cancellationDetails, // from stripe... Stolen Card, Expired, etc
              createdDate: new Date(sub.created * 1000),
              lastPaymentDate: lastPaymentDate,
              stripeCustomer: customer,
            };

            subscriptions.push(subscription);

            if (!productIds.includes(productId)) productIds.push(productId);
          }),
        );
      }
    }),
  );

  const products = await prisma.product.findMany({
    where: { stripeId: { in: productIds } },
  });

  let productIdToNameMap: Record<string, string> = {};

  if (products?.length > 0)
    products?.forEach(product => {
      productIdToNameMap[product.id] = product.name;
    });
  else productIdToNameMap = await getProductIdToNameMap(productIds);

  subscriptions.forEach((sub: PartialSubscription) => {
    if (sub.product?.stripeId) sub.product.name = productIdToNameMap[sub.product.stripeId];
  });

  return subscriptions;
};
