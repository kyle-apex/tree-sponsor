import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe>;

export const getStripe = () => {
  console.log('GET STRIPE', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};
