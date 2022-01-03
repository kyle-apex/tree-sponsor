import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import { DateDisplay } from 'components/sponsor';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import xss from 'xss';

const EventPage = ({ event }: { event: PartialEvent }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const xssSafeBio = event?.description && xss(event.description);

  return <Layout></Layout>;
};
/*
{!event ? (
        <Box>Event not found</Box>
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
                position: 'relative',
              }}
            >
              <Box style={{ position: 'relative', margin: '-50px auto 10px auto', width: '100px', height: '100px' }}>
                <SessionAvatar session={{ user: user }} size={100}></SessionAvatar>
              </Box>
              <Box sx={{ position: 'absolute', right: '10px' }}>
                <ShareButton user={user}></ShareButton>
              </Box>
              <Typography variant='h2' mb={1}>
                {user.displayName || user.name}
              </Typography>
              {rolesText && false && <Typography variant='subtitle1'>{rolesText}</Typography>}
              {joinDate && (
                <Typography variant='subtitle2'>
                  Joined <DateDisplay startDate={joinDate}></DateDisplay>
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
      */

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    const results = await axios.get(process.env.URL + '/api/events/' + path);
    return { props: { event: results.data } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null } };
}

export default EventPage;
