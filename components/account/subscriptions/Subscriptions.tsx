import { Card, CardActionArea, CardContent } from '@material-ui/core';
import React from 'react';
import { useGet } from 'utils/hooks/useGet';

const Subscriptions = () => {
  const { status, data: subscriptions } = useGet('/api/stripe/subscriptions', 'subscriptions');
  //const data: any[] = [];
  return (
    <div>
      {subscriptions?.map(subscription => (
        <Card key={subscription.id}>
          <CardActionArea>
            <CardContent>{subscription.id}</CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
};

export default Subscriptions;
