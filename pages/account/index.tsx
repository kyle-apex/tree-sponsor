import Layout from 'components/layout/Layout';
import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import serverSideIsAuthenticated from 'utils/auth/server-side-is-authenticated';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import MembershipPerks from 'components/membership/MembershipPerks';
import LaunchIcon from '@mui/icons-material/Launch';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
import { PartialUser, Session } from 'interfaces';
import Link from 'next/link';
import { useRouter } from 'next/router';
import RestrictSection from 'components/RestrictSection';
import { useSession } from 'next-auth/client';

export const getServerSideProps = serverSideIsAuthenticated;

const AccountPage = () => {
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('membership');
  const router = useRouter();
  const [nextSession] = useSession();

  const session = nextSession as Session;
  const user = session?.user;

  useEffect(() => {
    const onHashChangeStart = (url: string) => {
      const urlSplit = url.split('#');
      if (urlSplit.length > 0) {
        const tabName = urlSplit[1];
        if (tabName && ['membership', 'thanks', 'billing'].includes(tabName)) setActiveTab(tabName);
      }
    };

    onHashChangeStart(router.asPath);

    router.events.on('hashChangeStart', onHashChangeStart);

    return () => {
      router.events.off('hashChangeStart', onHashChangeStart);
    };
  }, [router.events]);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    router.push('/account', `#${newValue}`);
  };

  return (
    <Layout title='Account'>
      <SplitRow alignItems='center'>
        <Typography color='secondary' variant='h1'>
          Account
        </Typography>
        <Link href='/profile'>
          <Button variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
            Edit Profile/Contact Info
          </Button>
        </Link>
      </SplitRow>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
        <Tabs className='account-tabs' value={activeTab} onChange={handleTabChange} variant='fullWidth'>
          <Tab label='Membership' value='membership' />
          {user?.subscriptions?.length > 0 && <Tab label='Thank-A-Tree' value='thanks' />}
          <Tab label='Billing' value='billing' />
        </Tabs>
      </Box>
      <Box hidden={'membership' != activeTab}>
        <Typography variant='h2' color='secondary'>
          I want to...
        </Typography>
        <ul>
          <li>
            <Link href='/profile'>
              <a style={{ textDecoration: 'none' }}>
                <Typography color='primary'>Update my profile</Typography>
              </a>
            </Link>
          </li>
          {user?.subscriptions?.length > 0 ? (
            <>
              <li>
                <Link href='#billing'>
                  <a style={{ textDecoration: 'none' }}>
                    <Typography color='primary'>Manage my donation subscription</Typography>
                  </a>
                </Link>
              </li>
              <li>
                <Link href='#thanks'>
                  <a style={{ textDecoration: 'none' }}>
                    <Typography color='primary'>Thank my favorite trees</Typography>
                  </a>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link href='/signup'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Support the urban forest by becoming a member</Typography>
                </a>
              </Link>
            </li>
          )}
          <RestrictSection accessType='isAdmin'>
            <li>
              <Link href='/admin'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>View the Admin Panel</Typography>
                </a>
              </Link>
            </li>
          </RestrictSection>
        </ul>
        <MembershipPerks isMember={user?.subscriptions?.length > 0}></MembershipPerks>
      </Box>
      {user?.subscriptions?.length > 0 && (
        <Box hidden={'thanks' != activeTab}>
          <Sponsorships activeDonationAmount={activeDonationAmount}></Sponsorships>
        </Box>
      )}

      <Box hidden={'billing' != activeTab}>
        <Subscriptions setActiveDonationAmount={setActiveDonationAmount} isSectionActive={'thanks' === activeTab}></Subscriptions>
      </Box>
    </Layout>
  );
};

export default AccountPage;
