import Layout from 'components/layout/Layout';
import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import serverSideIsAuthenticated from 'utils/auth/server-side-is-authenticated';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import MembershipPerks from 'components/membership/MembershipPerks';

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
          <Tab label='Thank-A-Tree' />
          <Tab label='Membership' />
          <Tab label='Billing' />
        </Tabs>
      </Box>
      <Box hidden={0 != activeTab}>
        <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
      </Box>
      <Box hidden={1 != activeTab}>
        <MembershipPerks></MembershipPerks>
      </Box>
      <Box hidden={2 != activeTab}>
        <Subscriptions setActiveDonationAmount={setActiveDonationAmount} isSectionActive={1 === activeTab}></Subscriptions>
      </Box>
    </Layout>
  );
};

export default AccountPage;
