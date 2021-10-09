import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import 'fontsource-roboto';
import { Button, Box, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MapExample from 'components/MapExample';
import SponsorshipMap from 'components/sponsor/SponsorshipMap';
import SponsorshipDisplay from 'components/sponsor/SponsorshipDisplay';
import TFYPAboutSection from 'components/index/TFYPAboutSection';
import SponsorshipDisplayLoading from 'components/sponsor/SponsorshipDisplayLoading';

import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

import { signIn, signOut, useSession } from 'next-auth/client';
import CheckoutButton from 'components/CheckoutButton';
import { PartialSponsorship } from 'interfaces';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  headlineContainer: {
    height: 'calc(100vh - 100px)',
    minHeight: '600px',
  },
  treeDetailsContainer: {},
  headlineSubTitle: {
    marginBottom: theme.spacing(4),
  },
}));

const IndexPage = () => {
  const [session, loading] = useSession();
  const [sponsorships, setSponsorships] = useState<PartialSponsorship[]>([]);
  const [isLoadingSponsorships, setIsLoadingSponsorships] = useState(false);

  const getSponsorships = async () => {
    setIsLoadingSponsorships(true);
    const results = await axios.get('/api/sponsorships/home');

    parseResponseDateStrings(results.data);
    setSponsorships(results.data);
    setIsLoadingSponsorships(false);
  };

  useEffect(() => {
    getSponsorships();
  }, []);

  const classes = useStyles();
  return (
    <Layout>
      <Grid mt={-4} container className={classes.headlineContainer} direction='row' spacing={5}>
        <Grid md={5} justifyContent='center' sx={{ display: 'flex', flexDirection: 'column' }} item>
          <Typography variant='h2' color='secondary'>
            TreeFolksYP Tree Sponsorship
          </Typography>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            Make your mark with a tree sponsorship through TreeFolks Young Professionals (TreeFolksYP)
          </Typography>
          <Grid container direction='row' spacing={2}>
            <Grid item>
              <Link href='/about'>
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
        <Grid item md={7} direction='column' container alignContent='center' justifyContent='center'>
          <Box sx={{ height: '475px', maxHeight: 'calc(75vh)', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <SponsorshipMap></SponsorshipMap>
          </Box>
        </Grid>
      </Grid>
      <Grid mt={0} className={classes.treeDetailsContainer} alignItems='center'>
        <Typography variant='h2' color='secondary'>
          Support the Urban Forest
        </Typography>
        <Typography variant='subtitle1' className={classes.headlineSubTitle}>
          Your sponsorship is a 100% tax deductible donation to TreeFolks to plant, care for, and give away trees in the Austin and Central
          Texas Community
        </Typography>
        <Grid mb={10} container spacing={5} direction='row' justifyContent='space-around'>
          {isLoadingSponsorships &&
            [...Array(3)].map((_item, index) => (
              <Grid md={4} key={index} item>
                <SponsorshipDisplayLoading />
              </Grid>
            ))}
          {!isLoadingSponsorships &&
            sponsorships.map(sponsorship => (
              <Grid md={4} key={sponsorship.id} item>
                <SponsorshipDisplay sponsorship={sponsorship}></SponsorshipDisplay>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Box mt={5} p={5} className='index detail-section'>
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
    </Layout>
  );
};

export default IndexPage;
