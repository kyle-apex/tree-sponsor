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

import { PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { SponsorshipMap, SponsorshipSubTitle } from 'components/sponsor';
import Head from 'next/head';
import { DEFAULT_DESCRIPTION } from 'consts';
import parse from 'html-react-parser';
import xss from 'xss';

const UserProfilePage = ({ user, featuredId }: { user: PartialUser; featuredId: number }) => {
  if (user) {
    parseResponseDateStrings(user.sponsorships);
    parseResponseDateStrings(user.subscriptions);
  }
  user?.sponsorships?.forEach(sponsorship => {
    sponsorship.user = { profilePath: user.profilePath, name: user.name, displayName: user.displayName };
  });

  let initialDate: Date;
  const joinDate: Date = user?.subscriptions?.reduce((minDate: Date, sub) => {
    if (!minDate) minDate = sub.createdDate;
    if (minDate > sub.createdDate) minDate = sub.createdDate;
    return minDate;
  }, initialDate);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const rolesText = user?.roles?.length > 0 ? user.roles.map(role => role.name).join(' | ') : null;

  let featuredSponsorship = user?.sponsorships?.find(obj => obj.id == featuredId);

  if (!featuredSponsorship) featuredSponsorship = user?.sponsorships?.length > 0 && user?.sponsorships[0];

  const description = featuredSponsorship?.description ? featuredSponsorship.description : DEFAULT_DESCRIPTION;
  const titlePrefix = featuredSponsorship?.title ? user?.sponsorships[0].title : user?.displayName || user?.name;
  const title = `${titlePrefix} | Thank-a-Tree with TreeFolksYP`;
  const imageUrl = featuredSponsorship ? featuredSponsorship.pictureUrl : '';

  user?.sponsorships?.sort((a, b) => {
    if (a.id == featuredId) return -1;
    if (b.id == featuredId) return 1;
    return a.startDate > b.startDate ? -1 : 1;
  });
  //console.log('domPurity', DOMPurify);
  const xssSafeBio = user?.profile?.bio && xss(user.profile.bio);

  return (
    <Layout>
      {!user ? (
        <Box>Profile not found</Box>
      ) : (
        <>
          <Head>
            <meta property='og:image' content={imageUrl} key='ogimage' />
            <meta property='og:title' content={title} key='ogtitle' />
            <meta property='og:description' content={description} key='ogdesc' />
            <title>{title}</title>
          </Head>
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
              {joinDate && (
                <Typography variant='subtitle2'>
                  Joined <SponsorshipSubTitle startDate={joinDate}></SponsorshipSubTitle>
                </Typography>
              )}
              {xssSafeBio && (
                <Box sx={{ textAlign: 'left', marginBottom: -2, alignSelf: 'center', a: { color: theme => theme.palette.primary.main } }}>
                  {parse(xssSafeBio)}
                </Box>
              )}
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
                <Box sx={{ padding: '0 20px', textAlign: 'left', minHeight: '150px' }}>
                  {activeTab == 0 && user.sponsorships?.length > 0 && (
                    <SponsorshipGroup columnWidth={6} isLoading={false} sponsorships={user.sponsorships}></SponsorshipGroup>
                  )}
                  {activeTab == 0 && !(user.sponsorships?.length > 0) && (
                    <Typography>{user.displayName || user.name} has not added any public Tokens of Appre-tree-ation.</Typography>
                  )}

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
          </Container>{' '}
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { profilePath, t: featuredId } = context.query;

  try {
    const results = await axios.get(process.env.URL + '/api/u/' + profilePath);
    console.log('results.data', results.data);
    return { props: { user: results.data, featuredId: featuredId ?? 0 } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { user: null, featuredId: featuredId ?? 0 } };
}

export default UserProfilePage;
