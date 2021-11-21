import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';
import { SponsorshipDisplay, SponsorshipAddEditDialog, SponsorshipDisplayLoading, AddTreeButton } from 'components/sponsor';
import { PartialSponsorship } from 'interfaces';
import Typography from '@mui/material/Typography';

const Sponsorships = ({ activeDonationAmount }: { activeDonationAmount?: number }): JSX.Element => {
  const [availableSponsorshipCount, setAvailableSponsorshipCount] = useState(0);
  const { data: sponsorships, isFetched, refetch } = useGet<PartialSponsorship[]>('/api/me/sponsorships', 'my-sponsorships');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { remove } = useRemoveFromQuery<PartialSponsorship>('my-sponsorships', handleDelete);

  async function handleDelete(sponsorshipId: number) {
    await axios.delete('/api/sponsorships/' + sponsorshipId);
  }

  useEffect(() => {
    if (!sponsorships) return;
    const totalSponsorshipCount = (activeDonationAmount ?? 0) / 20;
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
        {isFetched && (
          <Grid item xs={12}>
            {!availableSponsorshipCount && (
              <Typography
                sx={{
                  backgroundColor: 'white',
                  padding: 1,
                  paddingRight: 2,
                  paddingLeft: 2,
                  border: 'solid 1px',
                  borderColor: theme => theme.palette.primary.main,
                  borderRadius: '5px',
                  marginTop: -2,
                  marginBottom: -2,
                }}
              >
                You do not have any available Tokens of Appre-tree-ation.
              </Typography>
            )}
            {availableSponsorshipCount && (
              <Typography
                sx={{
                  backgroundColor: 'white',
                  padding: 1,
                  border: 'solid 1px',
                  borderColor: theme => theme.palette.primary.main,
                  borderRadius: '5px',
                  marginTop: -2,
                  marginBottom: -2,
                }}
              >
                {availableSponsorshipCount > 1 ? (
                  <>
                    You have configured <strong>{sponsorships?.length || 0}</strong> of your <strong>{availableSponsorshipCount}</strong>{' '}
                    tokens of appre-tree-ation.
                  </>
                ) : (
                  <>
                    {sponsorships?.length > 0
                      ? 'You do not have any available tokens of appre-tree-ation.'
                      : 'You have one token of appre-tree-ation left to configure.'}
                  </>
                )}
              </Typography>
            )}
          </Grid>
        )}
        {!isFetched && (
          <Grid item xs={12} sm={6} md={3}>
            <SponsorshipDisplayLoading />
          </Grid>
        )}

        {isFetched && sponsorships && sponsorships?.length > 0 && (
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
