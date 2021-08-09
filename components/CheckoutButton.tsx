import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

import { getStripe } from 'utils/stripe/get-stripe-client';

import { useSession } from 'next-auth/client';
import { RedirectToCheckoutOptions } from '@stripe/stripe-js';

export default function CheckoutButton({ price }: { price: string }) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState(false);
  const [session] = useSession();

  const handleCheckout = async () => {
    /*if (!session) {
      return router.push('/signin');
    }*/
    price = price ?? 'price_1Ioq94KRkjW3h5nxlnL2qYXV';
    try {
      const { data } = await axios.post<RedirectToCheckoutOptions>('/api/stripe/create-checkout-session', {
        price,
      });
      console.log('datadata', data);
      const stripe = await getStripe();
      console.log('stripe', stripe);
      stripe.redirectToCheckout(data);
    } catch (error) {
      return alert(error.message);
    } finally {
      setPriceIdLoading(false);
    }
  };

  return <Button onClick={() => handleCheckout()}>Subscribe</Button>;
}
