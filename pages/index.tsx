import Link from 'next/link';
import Layout from '../components/layout/Layout';
import 'fontsource-roboto';
import { Button, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import MapExample from 'components/MapExample';
import TreeDetailsCard from 'components/sponsor/TreeDetailsCard';

import { signIn, signOut, useSession } from 'next-auth/client';
import CheckoutButton from 'components/CheckoutButton';
import TreeDetails from 'components/sponsor/TreeDetails';

const useStyles = makeStyles(theme => ({
  headlineContainer: {
    height: 'calc(100vh - 120px)',
  },
  treeDetailsContainer: {},
  headlineSubTitle: {
    marginBottom: theme.spacing(4),
  },
}));

const IndexPage = () => {
  const [session, loading] = useSession();
  const classes = useStyles();
  return (
    <Layout>
      <Grid container className={classes.headlineContainer} direction='row' spacing={5}>
        <Grid md={5} spacing={4} justify='center' container item direction='column'>
          <h1>TreeFolksYP Tree Sponsorship</h1>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            Make your mark with a tree sponsorship through TreeFolks Young Professionals (TreeFolksYP)
          </Typography>
          <Grid container direction='row' spacing={2}>
            <Grid item>
              <Link href='/about'>
                <Button variant='outlined' color='secondary'>
                  Learn about TreeFolks YP
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href='/sponsor'>
                <Button variant='contained' color='primary'>
                  Sponsor a Tree
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={7} direction='column' container alignContent='center' justify='center'>
          <MapExample></MapExample>
        </Grid>
      </Grid>
      <Grid container className={classes.treeDetailsContainer} alignItems='center' direction='column' spacing={5}>
        <h2>Support the Urban Forest</h2>
        <Typography variant='subtitle1' className={classes.headlineSubTitle}>
          Your sponsorship is a 100% tax deductible donation to TreeFolks to plant, care for, and give away trees in the Austin and Central
          Texas Community
        </Typography>
        <Grid container spacing={5} direction='row' justify='space-around'>
          <Grid item>
            <TreeDetailsCard />
          </Grid>
          <Grid item>
            <TreeDetailsCard />
          </Grid>
          <Grid item>
            <TreeDetailsCard />
          </Grid>
        </Grid>
      </Grid>
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
