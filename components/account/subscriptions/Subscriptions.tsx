import { Card, CardActionArea, CardContent, CardActions, Button, Grid, CardHeader, makeStyles } from '@material-ui/core';
import React from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { Product, Subscription, SubscriptionWithDetails } from '@prisma/client';

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
}));

const Subscriptions = () => {
  const classes = useStyles();
  const [session, loading] = useSession();
  type PartialSubscription = Partial<Subscription & { product?: Partial<Product> }>;
  const { data: subscriptions, isFetched, isFetching } = useGet<SubscriptionWithDetails[]>('/api/me/subscriptions', 'subscriptions');

  const launchClientPortal = async (customerId?: string) => {
    const { data } = await axios.get('/api/stripe/portal-session?customerId=' + customerId);
    window.location.href = data.url;
  };
  return (
    <>
      <h2>Subscriptions</h2>
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
              <Button size='medium' color='primary'>
                Become a Member
              </Button>
            </CardActions>
          </Card>
        )
      )}
    </>
  );
};

export default Subscriptions;
