import { PartialSubscription, StripeSubscription } from 'interfaces';
import { getCustomerName } from './get-customer-name';
import { getLastPaymentDateForSubscription } from './get-last-payment-date-for-subscription';
import { Stripe, stripe } from './init';
import { PrismaClient } from '@prisma/client';
import getProductIdToNameMap from './get-product-id-to-name-map';

export const findAllSubscriptionsForUser = async (email: string): Promise<PartialSubscription[]> => {
  const prisma = new PrismaClient();

  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 150,
    email: email,
    expand: ['data.subscriptions'],
  });

  const subscriptions: PartialSubscription[] = [];
  const productIds: string[] = [];

  await Promise.all(
    customers.data.map(async (customer: Stripe.Customer) => {
      if (customer?.subscriptions) {
        await Promise.all(
          customer.subscriptions.data.map(async (sub: StripeSubscription) => {
            const productId = sub.plan.product;

            const customerName: string = getCustomerName(customer);
            const lastPaymentDate: Date = await getLastPaymentDateForSubscription(sub);

            const subscription: PartialSubscription = {
              product: { stripeId: productId, amount: Math.round(sub.plan.amount / 100) },
              stripeId: sub.id,
              stripeCustomerId: sub.customer as string,
              user: { email: customer.email, name: customerName },
              status: sub.status,
              createdDate: new Date(sub.created * 1000),
              lastPaymentDate: lastPaymentDate,
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
