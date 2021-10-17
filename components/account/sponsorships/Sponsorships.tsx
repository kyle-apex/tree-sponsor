import { Grid, Box } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';
import { SponsorshipDisplay, SponsorshipAddEditDialog, SponsorshipDisplayLoading, AddTreeButton } from 'components/sponsor';
import { createTypeReferenceDirectiveResolutionCache } from 'typescript';

const Sponsorships = ({ activeDonationAmount }: { activeDonationAmount?: number }) => {
  const [availableSponsorshipCount, setAvailableSponsorshipCount] = useState(0);
  const { data: sponsorships, isFetched, isFetching, refetch } = useGet<any[]>('/api/me/sponsorships', 'my-sponsorships');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { remove } = useRemoveFromQuery('my-sponsorships', handleDelete);

  async function handleDelete(sponsorshipId: number) {
    await axios.delete('/api/sponsorships/' + sponsorshipId);
  }

  useEffect(() => {
    if (!sponsorships) return;
    const totalSponsorshipCount = activeDonationAmount / 20;
    setAvailableSponsorshipCount(Math.max(0, totalSponsorshipCount - sponsorships.length));
  }, [activeDonationAmount, sponsorships]);

  const handleDialogClose = (isOpen: SetStateAction<boolean>) => {
    console.log('isOpenDialogCLose', isOpen);
    setIsAddDialogOpen(isOpen);
    refetch();
  };

  return (
    <Box sx={{ marginBottom: '60px' }}>
      <Grid container spacing={4}>
        {!isFetched && (
          <Grid item xs={12} sm={6} md={3}>
            <SponsorshipDisplayLoading />
          </Grid>
        )}
        {isFetched && sponsorships?.length > 0 && (
          <>
            {sponsorships.map(sponsorship => (
              <Grid item xs={12} sm={6} md={3} key={sponsorship.id} className='same-height'>
                <SponsorshipDisplay isEditMode={true} sponsorship={sponsorship} onDelete={remove} />
              </Grid>
            ))}
          </>
        )}
        {isFetched && availableSponsorshipCount > 0
          ? [...Array(availableSponsorshipCount)].map((_a, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} className='same-height'>
                <AddTreeButton
                  onAddClick={() => {
                    setIsAddDialogOpen(true);
                  }}
                ></AddTreeButton>
              </Grid>
            ))
          : isFetched && (
              <Grid item xs={12} sm={6} md={3} className='same-height'>
                <AddTreeButton isStartSubscription={true}></AddTreeButton>
              </Grid>
            )}
      </Grid>
      <SponsorshipAddEditDialog isOpen={isAddDialogOpen} setIsOpen={handleDialogClose} />
    </Box>
  );
};

export default Sponsorships;
