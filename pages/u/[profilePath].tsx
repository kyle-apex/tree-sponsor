import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import MapIcon from '@mui/icons-material/MapOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import SessionAvatar from 'components/SessionAvatar';
import SponsorshipGroup from 'components/sponsor/SponsorshipGroup';

import { PartialSponsorship, PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { SponsorshipMap } from 'components/sponsor';

const UserProfilePage = ({ sponsorships, user }: { sponsorships?: PartialSponsorship[]; user: PartialUser }) => {
  const router = useRouter();
  const { profilePath } = router.query;
  parseResponseDateStrings(user.sponsorships);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    console.log('new Tab', newValue);
    setActiveTab(newValue);
  };

  const rolesText = user?.roles?.length > 0 ? user.roles.map(role => role.name).join(' | ') : null;

  return (
    <Layout>
      <Container
        maxWidth='md'
        sx={{ minHeight: 'calc(100vh - 185px)', marginBottom: 0, display: 'flex', flexDirection: 'column', paddingTop: 5 }}
      >
        <Box
          flexDirection='column'
          display='flex'
          className='box-shadow section-background'
          sx={{
            borderColor: theme => theme.palette.primary.main,
            borderRadius: '5px',
            border: 'solid 1px',
            padding: '10px 40px 30px',
            backgroundColor: 'white',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Box style={{ position: 'relative', margin: '-50px auto 10px auto', width: '100px', height: '100px' }}>
            <SessionAvatar session={{ user: user }} size={100}></SessionAvatar>
          </Box>
          <Typography variant='h2' mb={1}>
            {user.displayName || user.name}
          </Typography>
          {rolesText && false && <Typography variant='subtitle1'>{rolesText}</Typography>}
          <Typography variant='subtitle2'>Joined March 5, 2011</Typography>
        </Box>
        <Box
          flexDirection='column'
          display='flex'
          className='box-shadow section-background'
          sx={{
            borderColor: theme => theme.palette.primary.main,
            borderRadius: '5px',
            border: 'solid 1px',
            backgroundColor: 'white',
            width: '100%',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <Box mb={-6}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
              <Tabs
                className='account-tabs'
                value={activeTab}
                onChange={handleTabChange}
                variant='fullWidth'
                aria-label='basic tabs example'
              >
                <Tab label='Tokens of Appre-tree-ation' sx={{ borderTopLeftRadius: '5px' }} />
                <Tab
                  label={
                    <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapIcon />
                      <div>Map</div>
                    </Box>
                  }
                  sx={{ borderTopRightRadius: '5px' }}
                />
              </Tabs>
            </Box>
            <Box sx={{ padding: '0 20px', textAlign: 'left' }}>
              {activeTab == 0 && <SponsorshipGroup isLoading={false} sponsorships={user.sponsorships}></SponsorshipGroup>}
              {activeTab == 1 && (
                <Box
                  sx={{
                    height: '475px',
                    maxHeight: 'calc(75vh)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: 12,
                  }}
                >
                  <SponsorshipMap defaultSponsorships={user.sponsorships} isExploreMode={true}></SponsorshipMap>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { profilePath } = context.query;
  try {
    const results = await axios.get(process.env.URL + '/api/u/' + profilePath);
    return { props: { user: results.data } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { user: null } };
}

export default UserProfilePage;
