import Layout from 'components/layout/Layout';

import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';

import Link from 'next/link';
import serverSideIsAuthenticated from 'utils/auth/server-side-is-authenticated';
import React, { useState } from 'react';
import { Typography } from '@mui/material';

export const getServerSideProps = serverSideIsAuthenticated;

const AccountPage = () => {
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);

  return (
    <Layout title='Account'>
      <Typography color='secondary' variant='h1'>
        Account
      </Typography>
      <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
      <Subscriptions setActiveDonationAmount={setActiveDonationAmount}></Subscriptions>
    </Layout>
  );
};

export default AccountPage;
