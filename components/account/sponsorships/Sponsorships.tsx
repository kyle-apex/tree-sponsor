import { Card, CardActionArea, CardContent, CardActions, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import { Product, Subscription } from '@prisma/client';
import AddTreeButton from 'components/sponsor/AddTreeButton';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import axios from 'axios';
import SponsorshipDisplay from 'components/sponsor/SponsorshipDisplay';

const Sponsorships = () => {
  const [session, loading] = useSession();
  type PartialSubscription = Partial<Subscription & { product?: Partial<Product> }>;
  const { data: sponsorships, isFetched, isFetching } = useGet<any[]>('/api/me/sponsorships', 'my-sponsorships');

  const { remove } = useRemoveFromQuery('my-sponsorships', handleDelete);

  async function handleDelete(sponsorshipId: number) {
    await axios.delete('/api/sponsorships/' + sponsorshipId);
  }

  return (
    <>
      <Typography color='primary' variant='h2' mt={3}>
        Sponsorships
      </Typography>
      {!isFetched && <div>Loading...</div>}
      {isFetched && sponsorships?.length > 0 ? (
        <Grid container spacing={4}>
          {sponsorships.map(sponsorship => (
            <Grid item xs={12} sm={6} md={3} key={sponsorship.id}>
              <SponsorshipDisplay isEditMode={true} sponsorship={sponsorship} onDelete={remove} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3} key={-1}>
            <AddTreeButton></AddTreeButton>
          </Grid>
        </Grid>
      ) : (
        isFetched && (
          <Grid item xs={12} sm={6} md={3} key={-1}>
            <AddTreeButton></AddTreeButton>
          </Grid>
        )
      )}
    </>
  );
};

export default Sponsorships;
