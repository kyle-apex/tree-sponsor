import { NextApiRequest, NextApiResponse } from 'next';

import { stripe, Stripe } from 'utils/stripe/init';
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

  const productIds: string[] = [];

  subscriptions.forEach((sub: Stripe.Subscription) => {
    const productId = sub.plan.product;
    if (!productIds.includes(productId)) productIds.push(productId);
  });
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

  subscriptions.forEach((sub: Stripe.Subscription) => {
    sub.plan.product = productIdToNameMap[sub.plan.product];
  });

  //const portalSession = await createPortalSessionForEmail(session?.user?.email ?? '');
  res.status(200).json(subscriptions);
}
