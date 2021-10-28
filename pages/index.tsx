import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import { SponsorshipMap, SponsorshipDisplay, SponsorshipGallery, SponsorshipDisplayLoading } from 'components/sponsor';
import TFYPAboutSection from 'components/index/TFYPAboutSection';
import parsedGet from 'utils/api/parsed-get';

import { PartialSponsorship } from 'interfaces';
import useTheme from '@mui/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const IndexPage = () => {
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

  const theme = useTheme();
  const hasGallery = !useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Layout isFullWidth={true}>
      <Container maxWidth='lg'>
        <Grid
          mt={-4}
          container
          className={classes.headlineContainer + ' headline-section index'}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={5}
        >
          <Grid sm={5} md={5} xs={12} justifyContent='center' sx={{ display: 'flex', flexDirection: 'column' }} item>
            <Typography variant='h2' color='secondary'>
              TreeFolksYP Tree Sponsorship
            </Typography>
            <Typography variant='subtitle1' className={classes.headlineSubTitle}>
              Make your mark with a tree sponsorship through TreeFolks Young Professionals (TreeFolksYP)
            </Typography>
            <Grid container direction='row' spacing={2}>
              <Grid item>
                <Link href='/explore'>
                  <Button variant='outlined' color='secondary'>
                    Explore the Map
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href='/signup'>
                  <Button variant='contained' color='primary'>
                    Sponsor a Tree
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={7} sm={7} xs={12} direction='column' container alignContent='center' justifyContent='center'>
            <Box sx={{ height: '475px', maxHeight: 'calc(75vh)', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <SponsorshipMap></SponsorshipMap>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <div style={{ height: '150px', width: '100%', marginTop: '-40px', overflow: 'hidden' }}>
        <svg viewBox='0 0 500 150' preserveAspectRatio='none' style={{ height: '100%', width: '100%' }}>
          <path
            d='M-12.57,88.06 C161.18,180.06 283.68,5.08 527.42,136.06 L500.00,150.00 L-0.00,150.00 Z'
            style={{ stroke: 'none', fill: 'rgb(113, 153, 140)' }}
          ></path>
          <path
            d='M-5.69,119.06 C116.80,190.06 335.55,51.07 523.68,156.06 L500.00,150.00 L-0.00,150.00 Z'
            style={{ stroke: 'none', fill: 'rgb(72, 110, 98)' }}
          ></path>
        </svg>
      </div>
      <div className='wide-container index'>
        <Container maxWidth='lg'>
          <Grid container direction={{ xs: 'column', sm: 'row' }}>
            <Grid item sm={4}>
              <Box>
                <Box className='step-number'>1</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Start an annual donation to TreeFolks of $20 per tree
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Box>
                <Box className='step-number'>2</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Snag a picture of your special tree(s)
              </Typography>
            </Grid>
            <Grid item sm={4} className='center'>
              <Box>
                <Box className='step-number'>3</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Add trees to our sponsored tree map!
              </Typography>
              <Link href='/signup'>
                <Button variant='outlined' color='inherit'>
                  Get Started
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div style={{ height: '150px', width: '100%', overflow: 'hidden', transform: 'scaleY(-1) scaleX(-1)' }}>
        <svg viewBox='0 0 500 150' preserveAspectRatio='none' style={{ height: '100%', width: '100%' }}>
          <path
            d='M-17.21,138.05 C272.77,142.05 394.02,89.06 519.65,132.06 L507.15,160.06 L-0.00,150.00 Z'
            style={{ stroke: 'none', fill: 'rgb(72, 110, 98)' }}
          ></path>
        </svg>
      </div>
      <Container maxWidth='lg'>
        <Grid mt={0} className={classes.treeDetailsContainer} alignItems='center'>
          <Typography variant='h2' color='secondary'>
            Support the Urban Forest
          </Typography>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            Your sponsorship is a 100% tax deductible donation to TreeFolks to plant, care for, and give away trees in the Austin and
            Central Texas Community. Checkout a few sponsored trees:
          </Typography>
          <Grid mb={12} container spacing={5} direction='row' justifyContent='space-around' alignItems='stretch'>
            {isLoadingSponsorships &&
              !hasGallery &&
              [...Array(3)].map((_item, index) => (
                <Grid md={4} key={index} item>
                  <SponsorshipDisplayLoading />
                </Grid>
              ))}
            {!isLoadingSponsorships &&
              !hasGallery &&
              sponsorships.map(sponsorship => (
                <Grid md={4} key={sponsorship.id} item className='same-height start'>
                  <SponsorshipDisplay sponsorship={sponsorship}></SponsorshipDisplay>
                </Grid>
              ))}
            {hasGallery && (
              <Grid item xs={12} justifyContent='center'>
                {!isLoadingSponsorships && <SponsorshipGallery sponsorships={sponsorships} />}
                {isLoadingSponsorships && (
                  <Box sx={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <SponsorshipDisplayLoading />
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Box mt={8} p={5} className='index detail-section'>
          <Typography variant='h2'>What is TreeFolks Young Professionals?</Typography>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission of
            TreeFolks: planting, caring for, and giving people free trees to plant!
          </Typography>
        </Box>
        <Box mt={-15} className='index'>
          <TFYPAboutSection></TFYPAboutSection>
        </Box>
        {false && (
          <p>
            TreeFolks Young Professionals (TreeFolksYP) supports planting, caring for, and giving away free trees throughout Austin and
            Central Texas. TreeFolksYP membership includes tree sponsorship, but you do not have to be a member to be a sponsor!
          </p>
        )}
      </Container>
    </Layout>
  );
};

export default IndexPage;
