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
import CheckinHistoryDialog from 'components/event/CheckinHistoryDialog';
import useHash from 'utils/hooks/use-hash';
import AccountTrees from 'components/account/trees';
import IdentifyTreeFlow from 'components/tree/IdentifyTreeFlow';
import CopyIconButton from 'components/CopyIconButton';
import parsedGet from 'utils/api/parsed-get';
import { ReferralStats } from 'interfaces';

export const getServerSideProps = serverSideIsAuthenticated;

const AccountPage = () => {
  const [activeDonationAmount, setActiveDonationAmount] = useState(0);
  const [activeTab, setActiveTab] = useHash('membership', ['membership', 'trees', 'billing']);
  const router = useRouter();
  const [nextSession] = useSession();
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats>();

  const session = nextSession as Session;
  const user = session?.user;

  const getReferrals = async () => {
    const stats = (await parsedGet('/api/me/referrals')) as ReferralStats;
    setReferralStats(stats);
  };
  useEffect(() => {
    getReferrals();
  }, []);

  if (user?.email) localStorage.setItem('checkinEmail', JSON.stringify(user.email));

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setActiveTab(newValue);
  };

  const activeReferrals = referralStats?.referrals?.filter(ref => ref.status == 'active');
  const inactiveReferrals = referralStats?.referrals?.filter(ref => ref.status != 'active');

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
          <Tab label='Tree ID' value='trees' />
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
          {user?.eventCheckIns?.length > 0 && (
            <li>
              <a
                onClick={() => {
                  setIsHistoryDialogOpen(true);
                }}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <Typography color='primary'>View my event attendance history</Typography>
              </a>
              <CheckinHistoryDialog
                checkins={user.eventCheckIns}
                isOpen={isHistoryDialogOpen}
                setIsOpen={setIsHistoryDialogOpen}
                onNavigate={() => {
                  setIsHistoryDialogOpen(false);
                }}
              ></CheckinHistoryDialog>
            </li>
          )}
          <li>
            <a
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => {
                setActiveTab('trees');
              }}
            >
              <Typography color='primary'>Add tree identifications</Typography>
            </a>
          </li>
          {user?.subscriptions?.length > 0 && (
            <li>
              <Link href='/account/shirts'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Order a TreeFolksYP Member Shirt</Typography>
                </a>
              </Link>
            </li>
          )}
          {false && (
            <li>
              <Link href='/account/thank-a-tree'>
                <a style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Thank a Tree</Typography>
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
        {user && (
          <Box mb={3}>
            <Typography color='secondary'>Supporting Member Referral Link:</Typography>
            <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
              <CopyIconButton text={`tfyp.org/r/${user?.profilePath}`}></CopyIconButton>
              <Typography variant='subtitle2' color='gray'>
                {`tfyp.org/r/${user?.profilePath}`}
              </Typography>
            </Box>
            {referralStats && (
              <>
                <Box mt={1} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <Typography color='secondary'>Referred Members:</Typography>{' '}
                  <Typography variant='body1'>{referralStats.referrals?.length || 0}</Typography>
                </Box>
                {!!referralStats.numberOfDonations && (
                  <Box mt={1} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                    <Typography color='secondary'> Referral Donations:</Typography>{' '}
                    <Typography variant='body1'>{referralStats.numberOfDonations}</Typography>
                  </Box>
                )}
                {!!referralStats.numberOfDonations && (
                  <Box mt={1} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                    <Typography color='secondary'>Referral Donation Total:</Typography>{' '}
                    <Typography variant='body1'>${referralStats.amountOfDonations}</Typography>
                  </Box>
                )}
                {activeReferrals?.length > 0 && (
                  <Box mt={1} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography color='secondary'>Active Referrals:</Typography>
                    <Typography variant='body1'>{activeReferrals.map(ref => ref.name).join(', ')}</Typography>
                  </Box>
                )}
                {inactiveReferrals?.length > 0 && (
                  <Box mt={1} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography color='secondary'>Inactive Referrals:</Typography>
                    <Typography variant='body1'>
                      {inactiveReferrals
                        .map(ref => {
                          return ref.name + ` (${ref.status.replace('_', ' ')})`;
                        })
                        .join(', ')}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
        <MembershipPerks isMember={user?.subscriptions?.length > 0}></MembershipPerks>
      </Box>

      <Box hidden={'trees' != activeTab}>
        <AccountTrees></AccountTrees>
      </Box>

      <Box hidden={'billing' != activeTab}>
        <Subscriptions setActiveDonationAmount={setActiveDonationAmount} isSectionActive={'thanks' === activeTab}></Subscriptions>
      </Box>
    </Layout>
  );
};

export default AccountPage;
