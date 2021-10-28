import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { SubscriptionWithDetails } from '@prisma/client';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  cardTitle: {
    fontSize: '1.1rem',
  },
  cardContent: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(7),
  },
  amount: {
    fontSize: theme.typography.h4.fontSize,
    color: theme.palette.secondary.main,
    textAlign: 'center',
  },
  headingWithIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const Subscriptions = ({
  setActiveDonationAmount,
  isSectionActive,
}: {
  setActiveDonationAmount?: React.Dispatch<React.SetStateAction<number>>;
  isSectionActive?: boolean;
}) => {
  const classes = useStyles();
  const [session] = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: subscriptions, isFetched, refetch } = useGet<SubscriptionWithDetails[]>('/api/me/subscriptions', 'subscriptions');

  const refreshFromStripe = async () => {
    setIsRefreshing(true);
    await axios.post('/api/me/update-from-stripe', { email: session?.user?.email });
    await refetch();
    setIsRefreshing(false);
  };

  const launchClientPortal = async (customerId?: string) => {
    const { data } = await axios.get('/api/stripe/portal-session?customerId=' + customerId);
    window.location.href = data.url;
  };

  useEffect(() => {
    if (!subscriptions || !setActiveDonationAmount) return;
    let activeDonationAmount = 0;
    subscriptions.forEach(subscription => {
      if (subscription.status === 'active') activeDonationAmount += subscription.amount;
    });
    setActiveDonationAmount(activeDonationAmount);
  }, [subscriptions]);

  useEffect(() => {
    if (isSectionActive == true) refreshFromStripe();
  }, [isSectionActive]);

  return (
    <>
      {false && (
        <Typography color='primary' variant='h2' className={classes.headingWithIcon}>
          <IconButton onClick={refreshFromStripe}>
            <RefreshIcon fontSize='large' className={isRefreshing ? 'spin' : ''} />
          </IconButton>
        </Typography>
      )}
      {!isFetched && <div>Loading...</div>}
      {isFetched && subscriptions?.length > 0 ? (
        <Grid container spacing={4}>
          {subscriptions.map(subscription => (
            <Grid item xs={12} sm={6} md={4} key={subscription.id}>
              <Card color='primary'>
                <CardHeader
                  className={classes.cardHeader}
                  classes={{ title: classes.cardTitle }}
                  title={subscription?.productName}
                ></CardHeader>
                <CardContent className={classes.cardContent}>
                  <div className={classes.amount}>
                    ${subscription?.amount}/<span>year</span>
                  </div>
                  <div className='center'>
                    {subscription.status === 'active' ? 'Renews' : 'Expiration'}:{' '}
                    {new Date(subscription.expirationDate).toLocaleString('default', { month: 'long', day: 'numeric' })}
                    <span>, {new Date(subscription.expirationDate).getFullYear()}</span>
                  </div>
                  <div></div>
                </CardContent>
                <CardActions>
                  <Button
                    size='medium'
                    variant='outlined'
                    color='secondary'
                    fullWidth
                    onClick={() => launchClientPortal(subscription.stripeCustomerId)}
                  >
                    Manage
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        isFetched && (
          <Card>
            <CardActionArea>
              <CardContent>No subscription found relating to the email associated with this account: {session?.user?.email}</CardContent>
            </CardActionArea>
            <CardActions>
              <Link href='/signup'>
                <Button size='medium' color='primary'>
                  Become a Member
                </Button>
              </Link>
            </CardActions>
          </Card>
        )
      )}
    </>
  );
};

export default Subscriptions;
