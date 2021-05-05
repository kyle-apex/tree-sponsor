import { Card, CardActionArea, CardContent, CardActions, Button, Grid } from '@material-ui/core';
import React from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import Stripe from 'stripe';
import { PrismaClient, Product, Subscription, User } from '@prisma/client';
import { LensTwoTone } from '@material-ui/icons';
//const prisma = new PrismaClient();

const Subscriptions = () => {
  const [session, loading] = useSession();
  type PartialSubscription = Partial<Subscription & { product?: Partial<Product> }>;
  const { data: subscriptions } = useGet<PartialSubscription[]>('/api/stripe/subscriptions', 'subscriptions');
  //if (!subscriptions) subscriptions = [];
  //const subscriptions: any[] = [];
  const launchClientPortal = async (customerId?: string) => {
    const { data } = await axios.get('/api/stripe/portal-session?customerId=' + customerId);
    window.location.href = data.url;
  };
  //const subs2 = await prisma.user.findMany({ include: { subscriptions: true } });

  //console.log('subs2', subs2); //  const subs2: User = await prisma.user.create({ data: { name: 'kyle', email: 'what@who.com' } });

  //const subscriptions: any[] = [{ id: 'whatever' }, { id: 'another' }];
  return (
    <>
      <h2>Subscriptions</h2>
      {subscriptions?.length > 0 ? (
        <Grid container spacing={4}>
          {subscriptions.map(subscription => (
            <Grid item xs={12} sm={6} md={3} key={subscription.id}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <div>{subscription?.product?.name}</div>
                    <div>${subscription?.product?.amount}</div>
                    {subscription.id}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size='medium' color='primary' onClick={() => launchClientPortal(subscription.stripeCustomerId)}>
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
