import { Card, CardActionArea, CardContent, CardActions, Button, Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGet } from 'utils/hooks/use-get';
import { useSession } from 'next-auth/client';
import { Product, Subscription } from '@prisma/client';
import AddTreeButton from 'components/sponsor/AddTreeButton';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import axios from 'axios';
import SponsorshipDisplay from 'components/sponsor/SponsorshipDisplay';
import SponsorshipAddEditDialog from 'components/sponsor/SponsorshipAddEditDialog';
import SponsorshipDisplayLoading from 'components/sponsor/SponsorshipDisplayLoading';

const Sponsorships = ({ activeDonationAmount }: { activeDonationAmount?: number }) => {
  const [session, loading] = useSession();
  const [availableSponsorshipCount, setAvailableSponsorshipCount] = useState(0);
  const { data: sponsorships, isFetched, isFetching } = useGet<any[]>('/api/me/sponsorships', 'my-sponsorships');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { remove } = useRemoveFromQuery('my-sponsorships', handleDelete);

  async function handleDelete(sponsorshipId: number) {
    await axios.delete('/api/sponsorships/' + sponsorshipId);
  }

  useEffect(() => {
    if (!sponsorships) return;
    const totalSponsorshipCount = activeDonationAmount / 20;
    console.log('availablesponsorships', totalSponsorshipCount);
    setAvailableSponsorshipCount(Math.max(0, totalSponsorshipCount - sponsorships.length));
  }, [activeDonationAmount, sponsorships]);

  return (
    <Box sx={{ marginBottom: '60px' }}>
      <Typography color='primary' variant='h2' mt={3}>
        Sponsorships
      </Typography>

      <Grid container spacing={4}>
        {!isFetched && (
          <Grid item xs={12} sm={6} md={3}>
            <SponsorshipDisplayLoading />
          </Grid>
        )}
        {isFetched && sponsorships?.length > 0 && (
          <>
            {sponsorships.map(sponsorship => (
              <Grid item xs={12} sm={6} md={3} key={sponsorship.id}>
                <SponsorshipDisplay isEditMode={true} sponsorship={sponsorship} onDelete={remove} />
              </Grid>
            ))}
          </>
        )}
        {isFetched && availableSponsorshipCount > 0
          ? [...Array(availableSponsorshipCount)].map((_a, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <AddTreeButton
                  onAddClick={() => {
                    setIsAddDialogOpen(true);
                  }}
                ></AddTreeButton>
              </Grid>
            ))
          : isFetched && <AddTreeButton isStartSubscription={true}></AddTreeButton>}
      </Grid>
      <SponsorshipAddEditDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
    </Box>
  );
};

export default Sponsorships;
