import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import TFYPAboutSection from 'components/index/TFYPAboutSection';
import parsedGet from 'utils/api/parsed-get';
import { PartialUser, TitleSection } from 'interfaces';

import { PartialSponsorship } from 'interfaces';
import { PollutionIcon, FloodingIcon, CurveTop, CurveBottom } from 'components/index/icons';

import ShadeImage from 'components/index/icons/ShadeImage';
import AtmosphereImage from 'components/index/icons/AtmosphereImage';
import ActivitiesImage from 'components/index/icons/ActivitiesImage';
import AnimalsImage from 'components/index/icons/AnimalsImage';
import SignupForm from 'components/membership/SignupForm';
import CoreTeamBio from 'components/index/CoreTeamBio';
import { prisma } from 'utils/prisma/init';
import { TREE_BENEFITS } from 'consts';
import { getCoreTeamBios } from 'utils/user/get-core-team-bios';

const useStyles = makeStyles(theme => ({
  headlineContainer: {
    height: 'calc(100vh - 275px)',
    minHeight: '600px',
  },
  treeDetailsContainer: {},
  headlineSubTitle: {
    marginBottom: theme.spacing(4),
  },
}));

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

const IndexPage = ({
  stripePriceIdLow,
  stripePriceIdMedium,
  stripePriceIdHigh,
  users,
}: {
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
  users: PartialUser[];
}) => {
  const [sponsorships, setSponsorships] = useState<PartialSponsorship[]>([]);
  const [isLoadingSponsorships, setIsLoadingSponsorships] = useState(false);

  const getSponsorships = async () => {
    setIsLoadingSponsorships(true);
    const results = await parsedGet<PartialSponsorship[]>('sponsorships/home');
    setSponsorships(results);
    setIsLoadingSponsorships(false);
  };

  useEffect(() => {
    getSponsorships();
  }, []);

  const classes = useStyles();

  return (
    <Layout isFullWidth={true}>
      <Container maxWidth='lg'>
        <Box
          sx={{ marginTop: '0px !important', background: 'radial-gradient(circle at -50% -50%, #1b2b1c 0%, #486e62 70%)' }}
          p={5}
          className='index detail-section'
        >
          <Typography variant='h2'>What is TreeFolks Young Professionals?</Typography>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission of
            TreeFolks: planting, caring for, and giving people free trees to plant!
          </Typography>
        </Box>
        <Box mt={-15} mb={8} className='index'>
          <TFYPAboutSection></TFYPAboutSection>
        </Box>
      </Container>
      <Container maxWidth='lg'>
        <div
          style={{
            width: '100px',
            marginBottom: '25px',
            height: '3px',
            backgroundColor: '#486e62',
          }}
        ></div>
        <Typography variant='h2' color='secondary' mb={6}>
          Why Support the Urban Forest with an Annual Membership?
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
      </Container>
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
        ></SignupForm>
      </Box>

      <Container maxWidth='lg' sx={{ textAlign: 'center' }}>
        <div
          style={{
            width: '100px',
            marginBottom: '24px',
            height: '3px',
            backgroundColor: '#486e62',
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '56px',
          }}
        ></div>
        <Typography variant='h2' color='secondary' mb={5} sx={{ textAlign: 'center' }}>
          Meet Our Core Team
        </Typography>

        <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={2} mb={6}>
          <Grid item xs={12} sm={6} md={4} mb={4}>
            <CoreTeamBio
              user={{
                name: 'You?',
                image: 'https://www.treefolks.org/wp-content/uploads/2022/07/questionmark.png',
                profile: {
                  title: 'Click here to apply',
                  bio: 'TreeFolks Young Professionals Core Team members volunteer to help plan social, educational, volunteer, and fundraising events to help engage young professionals in planting trees and caring for the environment.',
                },
              }}
            ></CoreTeamBio>
          </Grid>
          {users?.map((user: PartialUser) => (
            <Grid key={user.id} item xs={12} sm={6} md={4} mb={4}>
              <CoreTeamBio user={user}></CoreTeamBio>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default IndexPage;
export async function getStaticProps() {
  const users = await getCoreTeamBios();
  return {
    props: {
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW || '',
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM || '',
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH || '',
      users,
    },
    revalidate: 60,
  };
}
