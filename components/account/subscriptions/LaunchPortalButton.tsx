import LoadingButton from 'components/LoadingButton';
import React, { useState } from 'react';
import axios from 'axios';

const LaunchPortalButton = ({ stripeCustomerId }: { stripeCustomerId?: string }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const launchClientPortal = async (customerId?: string) => {
    setIsLaunching(true);
    const { data } = await axios.get('/api/stripe/portal-session?customerId=' + customerId);
    window.location.href = data.url;
  };

  return (
    <LoadingButton
      size='medium'
      variant='outlined'
      color='secondary'
      className='full-width'
      onClick={() => launchClientPortal(stripeCustomerId)}
      isLoading={isLaunching}
    >
      Manage
    </LoadingButton>
  );
};
export default LaunchPortalButton;
