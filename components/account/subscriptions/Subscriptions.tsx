import { Card, CardActionArea, CardContent, CardActions, Button, Grid } from '@material-ui/core';
import React from 'react';
import { useGet } from 'utils/hooks/useGet';
import { useSession } from 'next-auth/client';

const Subscriptions = () => {
  const [session, loading] = useSession();
  //const { status, data: subscriptions } = useGet('/api/stripe/subscriptions', 'subscriptions');
  const subscriptions: any[] = [{ id: 'whatever' }, { id: 'another' }];
  return (<>
    <h2>Subscriptions</h2>
    { subscriptions?.length > 0 ? (
      <Grid container spacing={4}>
        {subscriptions?.map(subscription => (
          <Grid item xs="12" sm="6" md="3" key={subscription.id}>
            <Card>
              <CardActionArea>
                <CardContent>{subscription.id}</CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="medium" color="primary">
                  Manage
            </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>) : <Card>
      <CardActionArea>
        <CardContent>No subscription found relating to the email associated with this account: {session?.user?.email}</CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="medium" color="primary">
          Become a Member
        </Button>
      </CardActions>
    </Card>
    }
  </>
  );
};

export default Subscriptions;
