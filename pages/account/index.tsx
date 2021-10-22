import Layout from 'components/layout/Layout';
import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import EditProfile from 'components/account/profile/EditProfile';
import serverSideIsAuthenticated from 'utils/auth/server-side-is-authenticated';
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

export const getServerSideProps = serverSideIsAuthenticated;

const AccountPage = () => {
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout title='Account'>
      <Typography color='secondary' variant='h1'>
        Account
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
        <Tabs className='account-tabs' value={activeTab} onChange={handleTabChange} variant='fullWidth' aria-label='basic tabs example'>
          <Tab label='Sponsorships' />
          <Tab label='Billing' />
          <Tab label='Profile' />
        </Tabs>
      </Box>
      <Box hidden={0 != activeTab}>
        <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
      </Box>
      <Box hidden={1 != activeTab}>
        <Subscriptions setActiveDonationAmount={setActiveDonationAmount} isSectionActive={1 === activeTab}></Subscriptions>
      </Box>
      <Box hidden={2 != activeTab}>
        <EditProfile />
      </Box>
    </Layout>
  );
};

export default AccountPage;
