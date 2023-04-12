import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import Layout from 'components/layout/Layout';
import SplitRow from 'components/layout/SplitRow';
import React, { useEffect, useState } from 'react';
import { useGet } from 'utils/hooks/use-get';
import Link from 'next/link';
import { SubscriptionWithDetails } from '@prisma/client';

const AccountTreePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);
  const { data: subscriptions, isFetched, refetch } = useGet<SubscriptionWithDetails[]>('/api/me/subscriptions', 'subscriptions');

  useEffect(() => {
    if (!subscriptions || !setActiveDonationAmount) return;
    let activeDonationAmount = 0;
    subscriptions.forEach(subscription => {
      if (subscription.status === 'active') activeDonationAmount += subscription.amount;
    });
    setActiveDonationAmount(activeDonationAmount);
  }, [subscriptions]);
  return (
    <Layout title='Thank-a-Tree'>
      <SplitRow alignItems='baseline'>
        <Typography color='secondary' variant='h1' mb={4}>
          Thank-a-Tree
        </Typography>
        <Link href='/account'>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            Back to Account
          </Button>
        </Link>
      </SplitRow>

      <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
    </Layout>
  );
};

export default AccountTreePage;
