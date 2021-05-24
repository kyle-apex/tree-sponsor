import { PartialSubscription, StripeSubscription } from 'interfaces';
import { getCustomerName } from './get-customer-name';
import { getLastPaymentDateForSubscription } from './get-last-payment-date-for-subscription';
import { Stripe, stripe } from './init';

export const findAllSubscriptions = async (): Promise<PartialSubscription[]> => {
  const customers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    limit: 100,
    expand: ['data.subscriptions'],
  });
  //console.log('customers', customers);

  const subscriptions: PartialSubscription[] = [];
  const productIds: string[] = [];

  await Promise.all(
    customers.data.map(async (customer: Stripe.Customer) => {
      if (customer?.subscriptions) {
        if (customer.email == 'maureen.p.sweet@gmail.com') console.log('the customer', customer);
        await Promise.all(
          customer.subscriptions.data.map(async (sub: StripeSubscription) => {
            if (customer.email == 'maureen.p.sweet@gmail.com') console.log('mySub', sub);

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

            if (customer.email == 'maureen.p.sweet@gmail.com') console.log('subscription', subscription);

            subscriptions.push(subscription);

            if (!productIds.includes(productId)) productIds.push(productId);
          }),
        );
      }
    }),
  );

  const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
    limit: 50,
    ids: productIds,
  });
  //console.log('products', products);

  const productIdToNameMap: Record<string, string> = {};
  products?.data?.forEach((product: Stripe.Product) => {
    productIdToNameMap[product.id] = product.name;
  });

  console.log('subscriptions', subscriptions);

  subscriptions.forEach((sub: PartialSubscription) => {
    if (sub.product?.stripeId) sub.product.name = productIdToNameMap[sub.product.stripeId];
  });

  return subscriptions;

  //console.log('subscriptions', subscriptions);
};
