import { useState } from 'react';
import axios from 'axios';
import LoadingButton from 'components/LoadingButton';

import { getStripe } from 'utils/stripe/get-stripe-client';

import { RedirectToCheckoutOptions } from '@stripe/stripe-js';

export default function CheckoutButton({
  price,
  metadata,
  isForMembership,
  label,
  cancelRedirectPath,
}: {
  price: string;
  metadata?: Record<string, string>;
  isForMembership?: boolean;
  label?: string;
  cancelRedirectPath?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    price = price ?? 'price_1Ioq94KRkjW3h5nxlnL2qYXV';
    setIsLoading(true);
    try {
      const { data } = await axios.post<RedirectToCheckoutOptions>('/api/stripe/create-checkout-session', {
        price,
        metadata,
        isForMembership,
        cancelRedirectPath,
      });
      const stripe = await getStripe();
      stripe.redirectToCheckout(data);
    } catch (error: unknown) {
      setIsLoading(false);
      return alert((error as Error).message);
    } finally {
      //
    }
  };

  return (
    <>
      <LoadingButton
        size='large'
        isLoading={isLoading}
        className={'full-width'}
        variant='contained'
        color='secondary'
        onClick={() => handleCheckout()}
      >
        {label ?? 'Subscribe'}
      </LoadingButton>
    </>
  );
}
