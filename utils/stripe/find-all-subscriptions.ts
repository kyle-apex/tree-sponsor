import { PartialSubscription, StripeSubscription } from 'interfaces';
import { getCustomerName } from './get-customer-name';
import { getLastPaymentDateForSubscription } from './get-last-payment-date-for-subscription';
import { Stripe, stripe } from './init';

export const findAllSubscriptions = async (): Promise<PartialSubscription[]> => {
  let t1 = new Date().getTime();
  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 100,
    expand: ['data.subscriptions'],
  });
  console.log('getCustomers Time', customers.data.length, new Date().getTime() - t1);
  //console.log('customers', customers);

  const subscriptions: PartialSubscription[] = [];
  const productIds: string[] = [];
  t1 = new Date().getTime();
  await Promise.all(
    customers.data.map(async (customer: Stripe.Customer) => {
      if (customer?.subscriptions) {
        await Promise.all(
          customer.subscriptions.data.map(async (sub: StripeSubscription) => {
            const productId = sub.plan.product;

            const customerName: string = getCustomerName(customer);
            const t2 = new Date().getTime();
            const lastPaymentDate: Date = await getLastPaymentDateForSubscription(sub);
            console.log('getLastPayment Time', new Date().getTime() - t2);
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
  console.log('getPayment Details Time', new Date().getTime() - t1);
  t1 = new Date().getTime();
  const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
    limit: 50,
    ids: productIds,
  });
  console.log('list products time', new Date().getTime() - t1);
  //console.log('products', products);

  const productIdToNameMap: Record<string, string> = {};
  products?.data?.forEach((product: Stripe.Product) => {
    productIdToNameMap[product.id] = product.name;
  });

  subscriptions.forEach((sub: PartialSubscription) => {
    if (sub.product?.stripeId) sub.product.name = productIdToNameMap[sub.product.stripeId];
  });

  return subscriptions;
};
