import { PartialSubscription, StripeSubscription } from 'interfaces';
import { getCustomerName } from './get-customer-name';
import { getLastPaymentDateForSubscription } from './get-last-payment-date-for-subscription';
import getProductIdToNameMap from './get-product-id-to-name-map';
import { Stripe, stripe } from './init';

export const findAllSubscriptions = async (): Promise<PartialSubscription[]> => {
  let t1 = new Date().getTime();

  const allCustomers: Stripe.Customer[] = [];

  //let customers: Stripe.ApiList<Stripe.Customer>;

  //const starting_after = null;
  /*
  while (!customers.data || customers.data.length === 100) {
    customers = await stripe.customers.list({
      limit: 100,
      expand: ['data.subscriptions'],
      starting_after: starting_after
    });
    if (customers.data?.length > 0) { 
      allCustomers.concat(...customers.data);
      starting_after = allCustomers

    }
  }*/

  for await (const customer of stripe.customers.list({ limit: 100, expand: ['data.subscriptions'] })) {
    allCustomers.push(customer);
  }

  console.log('getCustomers Time', allCustomers.length, new Date().getTime() - t1);
  //console.log('customers', customers);

  const subscriptions: PartialSubscription[] = [];
  const productIds: string[] = [];
  t1 = new Date().getTime();
  await Promise.all(
    allCustomers.map(async (customer: Stripe.Customer) => {
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

  const productIdToNameMap = await getProductIdToNameMap(productIds);

  subscriptions.forEach((sub: PartialSubscription) => {
    if (sub.product?.stripeId) sub.product.name = productIdToNameMap[sub.product.stripeId];
  });

  return subscriptions;
};
