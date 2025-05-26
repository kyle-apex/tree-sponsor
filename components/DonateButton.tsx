import { useState } from 'react';
import axios from 'axios';
import LoadingButton from 'components/LoadingButton';
import { getStripe } from 'utils/stripe/get-stripe-client';

export default function DonateButton({
  amount,
  metadata,
  label,
  cancelRedirectPath,
  returnUrl,
  variant = 'contained',
  color = 'secondary',
  size = 'large',
  fullWidth = true,
}: {
  amount: number;
  metadata?: Record<string, string>;
  label?: string;
  cancelRedirectPath?: string;
  returnUrl?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDonation = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/stripe/create-one-time-checkout', {
        amount,
        metadata,
        cancelRedirectPath,
        returnUrl,
      });
      const stripe = await getStripe();
      stripe.redirectToCheckout(data);
    } catch (error: unknown) {
      setIsLoading(false);
      return alert((error as Error).message);
    }
  };

  return (
    <LoadingButton
      size={size}
      isLoading={isLoading}
      className={fullWidth ? 'full-width' : ''}
      variant={variant}
      color={color}
      onClick={() => handleDonation()}
    >
      {label ?? `Donate $${amount}`}
    </LoadingButton>
  );
}
