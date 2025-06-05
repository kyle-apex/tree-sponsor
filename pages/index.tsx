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
  // Common styling for all icons to ensure consistent positioning
  const iconStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (title) {
    case 'Pollution':
      return (
        <Box sx={iconStyle}>
          <PollutionIcon />
        </Box>
      );
    case 'Flood Prevention':
      return (
        <Box sx={iconStyle}>
          <FloodingIcon />
        </Box>
      );
    case 'Homes':
      return (
        <Box sx={iconStyle}>
          <AnimalsImage />
        </Box>
      );
    case 'Shade':
      return (
        <Box sx={iconStyle}>
          <ShadeImage />
        </Box>
      );
    case 'Atmosphere':
      return (
        <Box sx={iconStyle}>
          <AtmosphereImage />
        </Box>
      );
    case 'Activities':
      return (
        <Box sx={iconStyle}>
          <ActivitiesImage />
        </Box>
      );
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
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant='overline'
            sx={{
              color: '#486e62',
              fontWeight: 600,
              letterSpacing: 1.5,
              fontSize: '1rem',
              display: 'block',
              mb: 1,
            }}
          >
            BENEFITS OF TREES
          </Typography>
          <Typography
            variant='h2'
            color='secondary'
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#486e62',
              },
            }}
          >
            Why Support the Urban Forest?
          </Typography>
          <Typography
            variant='subtitle1'
            color='text.secondary'
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mt: 3,
              mb: 5,
            }}
          >
            Your annual membership helps grow and maintain our urban forest, creating a healthier and more sustainable community for
            everyone.
          </Typography>
        </Box>
        <Grid container spacing={3} mb={6}>
          {TREE_BENEFITS.map((benefit, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 3.5,
                  borderRadius: 3,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(145deg, #ffffff, #f5f9f7)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 28px rgba(72, 110, 98, 0.15)',
                    background: 'linear-gradient(145deg, #f5f9f7, #ffffff)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle at top right, rgba(72, 110, 98, 0.05) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    borderRadius: '50%',
                    width: 90,
                    height: 90,
                    background: 'linear-gradient(135deg, rgba(72, 110, 98, 0.18) 0%, rgba(72, 110, 98, 0.08) 100%)',
                    border: '2px solid rgba(72, 110, 98, 0.25)',
                    mx: 'auto',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(72, 110, 98, 0.25) 0%, rgba(72, 110, 98, 0.15) 100%)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(72, 110, 98, 0.2)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 1,
                    },
                  }}
                >
                  <Box sx={{ width: '60px', height: '60px', position: 'relative', zIndex: 2 }}>{getIcon(benefit.title)}</Box>
                </Box>
                <Typography
                  variant='h6'
                  color='primary'
                  sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                    mb: 1.5,
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '3px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(72, 110, 98, 0.3)',
                    },
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    mt: 1.5,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
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
