import { Stripe, stripe } from './init';

export const getLastPaymentDateForSubscription = async (subscription: Stripe.Subscription): Promise<Date> => {
  let lastPaymentTime = subscription.current_period_start;

  //if (subscription.status == 'past_due') {
  const invoices: Stripe.ApiList<Stripe.Invoice> = await stripe.invoices.list({ subscription: subscription.id });
  lastPaymentTime = 0;
  invoices.data.forEach((invoice: Stripe.Invoice) => {
    if (invoice.amount_paid > 0 && (!lastPaymentTime || invoice.created > lastPaymentTime) && !invoice.post_payment_credit_notes_amount)
      lastPaymentTime = invoice.created;
  });
  //}

  return lastPaymentTime ? new Date(lastPaymentTime * 1000) : null;
};
