import { NextApiRequest, NextApiResponse } from 'next';

import { stripe, Stripe } from 'utils/stripe/init';
import { getSession } from 'next-auth/client';
import { Subscription, Product } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 50,
    email: session?.user?.email ?? '',
    expand: ['data.subscriptions'],
  });
  console.log('customers', customers);

  type PartialSubscription = Partial<Subscription & { product?: Partial<Product> }>;
  type StripeSubscription = Stripe.Subscription & { plan?: { product?: string; amount: number } };

  const subscriptions: PartialSubscription[] = [];

  const productIds: string[] = [];

  customers.data.forEach((customer: Stripe.Customer) => {
    if (customer?.subscriptions) {
      customer.subscriptions.data.forEach((sub: StripeSubscription) => {
        console.log('mySub', sub);
        const productId = sub.plan.product;
        subscriptions.push({
          product: { stripeId: productId, amount: Math.round(sub.plan.amount / 100) },
          stripeId: sub.id,
          stripeCustomerId: sub.customer as string,
        });
        if (!productIds.includes(productId)) productIds.push(productId);
      });
    }
    //subscriptions.push(...customer.subscriptions.data);
  });
  console.log('subscriptions', subscriptions);
  console.log('productIds', productIds);

  const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
    limit: 50,
    ids: productIds,
  });
  console.log('products', products);

  const productIdToNameMap: Record<string, string> = {};
  products?.data?.forEach((product: Stripe.Product) => {
    productIdToNameMap[product.id] = product.name;
  });

  subscriptions.forEach((sub: PartialSubscription) => {
    if (sub.product?.stripeId) sub.product.name = productIdToNameMap[sub.product.stripeId];
  });

  res.status(200).json(subscriptions);
}
