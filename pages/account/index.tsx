import Layout from 'components/layout/Layout';

import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';

import Link from 'next/link';
import serverSideIsAuthenticated from 'utils/auth/server-side-is-authenticated';
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { boxSizing } from '@mui/system';

export const getServerSideProps = serverSideIsAuthenticated;

const AccountPage = () => {
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: any, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout title='Account'>
      <Typography color='secondary' variant='h1'>
        Account
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
        <Tabs value={activeTab} onChange={handleTabChange} variant='fullWidth' aria-label='basic tabs example'>
          <Tab label='Sponsorships' />
          <Tab label='Subscriptions' />
          <Tab label='Profile' />
        </Tabs>
      </Box>
      <Box hidden={0 != activeTab}>
        <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
      </Box>
      <Box hidden={1 != activeTab}>
        <Subscriptions setActiveDonationAmount={setActiveDonationAmount} isSectionActive={1 === activeTab}></Subscriptions>
      </Box>
    </Layout>
  );
};

export default AccountPage;
