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
import ShareButton from 'components/share/ShareButton';
import { PollutionIcon, FloodingIcon, CurveTop, CurveBottom } from 'components/index/icons';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

import ShadeImage from 'components/index/icons/ShadeImage';
import AtmosphereImage from 'components/index/icons/AtmosphereImage';
import ActivitiesImage from 'components/index/icons/ActivitiesImage';
import AnimalsImage from 'components/index/icons/AnimalsImage';

import { PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { SponsorshipMap, DateDisplay } from 'components/sponsor';
import Head from 'next/head';
import { DEFAULT_DESCRIPTION, TREE_BENEFITS } from 'consts';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import Grid from '@mui/material/Grid';
import { useSwipeable } from 'react-swipeable';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import useTheme from '@mui/styles/useTheme';
import SignupForm from 'components/membership/SignupForm';

const getIcon = (title: string) => {
  switch (title) {
    case 'Pollution':
      return <PollutionIcon />;
    case 'Flood Prevention':
      return <FloodingIcon />;
    case 'Homes':
      return <AnimalsImage />;
    case 'Shade':
      return <ShadeImage />;
    case 'Atmosphere':
      return <AtmosphereImage />;
    case 'Activities':
      return <ActivitiesImage />;
  }
};

const UserReferralPage = ({
  user,
  featuredId,
  stripePriceIdLow,
  stripePriceIdMedium,
  stripePriceIdHigh,
}: {
  user: PartialUser;
  featuredId: number;
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
}) => {
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setActiveTab(newValue);
  };

  const rolesText = user?.roles?.length > 0 ? user.roles.map(role => role.name).join(' | ') : null;

  let featuredSponsorship = user?.sponsorships?.find(obj => obj.id == featuredId);

  if (!featuredSponsorship) featuredSponsorship = user?.sponsorships?.length > 0 && user?.sponsorships[0];

  const description =
    (user.displayName || user.name) +
    ' would like to invite you to become a TreeFolksYP supporting member with an annual donation to TreeFolks.';
  const title = "You're Invited! TreeFolks Supporting Membership via " + (user.displayName || user.name);
  const imageUrl = '/preview-images/tree-giveaway-photo.jpeg';

  user?.sponsorships?.sort((a, b) => {
    if (a.id == featuredId) return -1;
    if (b.id == featuredId) return 1;
    return a.startDate > b.startDate ? -1 : 1;
  });

  const nextIndex: React.MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();

    setCarouselIndex(idx => {
      idx++;
      if (idx >= 6) idx = 0;
      return idx;
    });
  };

  const theme = useTheme();

  const isMobile = !useMediaQuery(theme.breakpoints.up(500));

  const prevIndex: React.MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();
    setCarouselIndex(idx => {
      idx--;
      if (idx < 0) idx = 5;
      return idx;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextIndex(null),
    onSwipedRight: () => prevIndex(null),
  });

  return (
    <Layout isFullWidth={true} title={title} description={description}>
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
          <Container maxWidth='lg'>
            <Box sx={{ marginTop: '50px !important', paddingBottom: '40px !important' }} p={5} pt={1} className='index detail-section'>
              <Box style={{ position: 'relative', margin: '-50px auto 10px auto', width: '100px', height: '100px' }}>
                <SessionAvatar session={{ user: user }} size={100}></SessionAvatar>
              </Box>
              <Typography
                variant='subtitle2'
                className='primary-info'
                sx={{ mb: 2, textAlign: 'center', padding: '8px 12px', maxWidth: '430px', marginLeft: 'auto', marginRight: 'auto' }}
              >
                {user.displayName || user.name} would like to invite you to become a TreeFolksYP supporting member with an annual donation
                to TreeFolks.
              </Typography>
              <hr></hr>
              <Typography variant='h2' sx={{ mt: 3 }}>
                What is TreeFolks?
              </Typography>
              <Typography variant='subtitle1' sx={{ mb: 3 }}>
                TreeFolks (Austin&apos;s tree planting nonprofit) plants and gives away thousands of trees across Central Texas every year
                with support from people like you.
              </Typography>
              <Typography variant='h2' sx={{ mt: 5 }}>
                What is TreeFolksYP?
              </Typography>
              <Typography variant='subtitle1' sx={{ mb: 3 }}>
                TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission
                of TreeFolks: planting, caring for, and giving folks free trees to plant!
              </Typography>
            </Box>
          </Container>
          <Container maxWidth='md' sx={{ marginBottom: 0, display: 'flex', flexDirection: 'column', paddingTop: 5 }}>
            <Typography variant='h2' color='secondary' mb={6}>
              Why Support the Urban Forest with an Annual Donation?
            </Typography>
            <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={2} mb={5}>
              {TREE_BENEFITS.map((benefit, idx) => (
                <Grid key={idx} item xs={12} sm={4} mb={4}>
                  <Grid container gap='15px' wrap='nowrap' direction={{ xs: 'row', sm: 'row', md: 'row' }}>
                    <Grid item className='icon-container' alignSelf={{ xs: 'start', sm: 'center' }}>
                      {getIcon(benefit.title)}
                    </Grid>
                    <Grid item>
                      <Typography variant='h6' color='primary'>
                        {benefit.title}
                      </Typography>
                      <Typography variant='caption'>{benefit.description}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            {false && (
              <Box sx={{ position: 'relative' }}>
                <IconButton aria-label='share' sx={{ top: '50%', left: 5 }} className='hoverImageIconButton' onClick={prevIndex}>
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  aria-label='share'
                  sx={{ top: '50%', right: 5, zIndex: 1001 }}
                  className='hoverImageIconButton'
                  onClick={nextIndex}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            )}
          </Container>
        </>
      )}
      <div style={{ height: '150px', width: '100%', marginTop: '-80px', overflow: 'hidden' }}>
        <CurveTop />
      </div>
      <div className='wide-container index'>
        <Container maxWidth='sm'>
          <Typography color='white' variant='h1' sx={{ fontSize: '2rem' }}>
            Become a Supporting Member
          </Typography>
          <Typography variant='body2' mb={-1}>
            Support the Central Texas urban forest with an annual membership. Please select a TreeFolks donation level below:
          </Typography>
        </Container>
      </div>
      <div
        style={{
          height: '360px',
          marginBottom: '-360px',
          width: '100%',
          overflow: 'hidden',
          transform: 'scaleY(-1) scaleX(-1)',
          marginTop: '-1px',
        }}
      >
        <CurveBottom />
      </div>
      <Box>
        <SignupForm
          stripePriceIdHigh={stripePriceIdHigh}
          stripePriceIdLow={stripePriceIdLow}
          stripePriceIdMedium={stripePriceIdMedium}
          foundFromSource={user?.name}
          cancelRedirectPath={'/r/' + user.profilePath}
        ></SignupForm>
      </Box>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { profilePath, t: featuredId } = context.query;

  try {
    const results = await axios.get(process.env.URL + '/api/u/' + profilePath);
    console.log('results', results);
    return {
      props: {
        user: results.data,
        featuredId: featuredId ?? 0,
        stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW || '',
        stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM || '',
        stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH || '',
      },
    };
  } catch (err) {
    console.log('err', err);
  }
  return {
    props: {
      user: null,
      featuredId: featuredId ?? 0,
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW || '',
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM || '',
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH || '',
    },
  };
}

export default UserReferralPage;
