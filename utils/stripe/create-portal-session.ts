import { Stripe, stripe } from './init';

export const createPortalSession = async function (
  customerId: string,
  returnURL: string,
): Promise<Stripe.BillingPortal.Session | undefined> {
  if (!customerId) return;

  const session: Stripe.BillingPortal.Session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnURL,
  });
  console.log('session', session);
  return session;
};

//export default createPortalSessionForEmail;
