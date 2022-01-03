import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Layout from 'components/layout/Layout';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import ShareButton from 'components/share/ShareButton';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import MapIcon from '@mui/icons-material/MapOutlined';
import DateDisplay from 'components/sponsor/DateDisplay';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

const EventPage = ({ event }: { event: PartialEvent }) => {
  const [activeTab, setActiveTab] = useState(0);

  console.log('event', event);

  if (event) {
    parseResponseDateStrings(event);
  }
  console.log('after event', event);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const description = event?.description;
  const title = `${event.name} | Thank-a-Tree with TreeFolksYP`;
  const imageUrl = '';

  const trees = event.categories?.flatMap(category => category.trees);
  console.log('trees', trees);

  return (
    <Layout>
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
              <Box style={{ position: 'relative', margin: '-50px auto 10px auto', width: '100px', height: '100px' }}></Box>
              <Box sx={{ position: 'absolute', right: '10px' }}>
                <ShareButton></ShareButton>
              </Box>
              <Typography variant='h2' mb={1}>
                {event.name}
              </Typography>
              {event.startDate && (
                <Typography variant='subtitle2'>
                  Date: <DateDisplay startDate={event.startDate}></DateDisplay>
                </Typography>
              )}
              {event?.description && (
                <Box sx={{ marginBottom: -2, mt: 2, alignSelf: 'center' }}>
                  <SafeHTMLDisplay html={event.description}></SafeHTMLDisplay>
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
                    <Tab label='Trees' sx={{ borderTopLeftRadius: '5px' }} />
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
                  {activeTab == 0 && trees?.length > 0 && <></>}
                  {activeTab == 0 && !(trees?.length > 0) && <Typography>{event.name} does not have any trees.</Typography>}

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
                    ></Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    //const results = await axios.get(process.env.URL + '/api/events/' + path);
    const results = {
      data: {
        name: 'Some Event',
        startDate: eval(JSON.stringify(new Date())),
        categories: [{ name: 'Tree of the Year', trees: { name: 'Some Other Tree' } }],
      },
    };
    return { props: { event: results.data } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null } };
}

export default EventPage;
