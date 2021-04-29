import { Card, CardActionArea, CardContent, CardActions, Button, Grid } from '@material-ui/core';
import React from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import axios from 'axios';

const Subscriptions = () => {
  const [session, loading] = useSession();
  const { status, data: subscriptions } = useGet('/api/stripe/subscriptions', 'subscriptions');

  const launchClientPortal = async (customerId: string) => {
    const { data } = await axios.get('/api/stripe/portal-session?customerId=' + customerId);
    window.location.href = data.url;
  };

  //const subscriptions: any[] = [{ id: 'whatever' }, { id: 'another' }];
  return (
    <>
      <h2>Subscriptions</h2>
      {subscriptions?.length > 0 ? (
        <Grid container spacing={4}>
          {subscriptions?.map(subscription => (
            <Grid item xs='12' sm='6' md='3' key={subscription.id}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <div>{subscription.plan.product}</div>
                    <div>${subscription?.plan.amount / 100}</div>
                    {subscription.id}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size='medium' color='primary' onClick={() => launchClientPortal(subscription.customer)}>
                    Manage
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
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
      )}
    </>
  );
};

export default Subscriptions;
