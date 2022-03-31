import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useGet, useRemoveFromQuery, useUpdateQueryById } from 'utils/hooks';
import axios from 'axios';
import { SponsorshipDisplay, SponsorshipAddEditDialog, SponsorshipDisplayLoading, AddTreeButton } from 'components/sponsor';
import { PartialSponsorship, ReviewStatus } from 'interfaces';
import Typography from '@mui/material/Typography';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';

const updateSponsorship = async (id: number, attributes: Record<string, unknown>) => {
  await axios.patch('/api/sponsorships/' + id, { reviewStatus: attributes.reviewStatus });
};

async function fetchSponsorships(reviewStatusFilter = '') {
  const queryString = reviewStatusFilter ? '?reviewStatus=' + encodeURIComponent(reviewStatusFilter) : '';
  return parsedGet<PartialSponsorship[]>('/api/sponsorships' + queryString);
}

const Sponsorships = ({
  activeDonationAmount,
  isReview,
  reviewStatusFilter,
}: {
  activeDonationAmount?: number;
  isReview?: boolean;
  reviewStatusFilter?: string;
}): JSX.Element => {
  const apiKey = isReview ? ['review-sponsorships', reviewStatusFilter] : ['my-sponsorships', reviewStatusFilter];

  const {
    data: sponsorships,
    isFetched,
    refetch,
  } = isReview
    ? useQuery<PartialSponsorship[]>(apiKey, () => fetchSponsorships(reviewStatusFilter), {
        keepPreviousData: true,
      })
    : useGet<PartialSponsorship[]>('/api/me/sponsorships', apiKey);

  const [availableSponsorshipCount, setAvailableSponsorshipCount] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { remove } = useRemoveFromQuery<PartialSponsorship>(apiKey, handleDelete);
  const { updateById } = useUpdateQueryById(apiKey, updateSponsorship);

  async function handleDelete(sponsorshipId: number) {
    await axios.delete('/api/sponsorships/' + sponsorshipId);
  }

  useEffect(() => {
    if (!sponsorships) return;
    const totalSponsorshipCount = Math.floor((activeDonationAmount ?? 0) / 20);
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
        {isFetched && !isReview && (
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
                    You have configured <strong>{sponsorships?.length || 0}</strong> of your{' '}
                    <strong>{availableSponsorshipCount + sponsorships.length}</strong> tokens of appre-tree-ation.
                  </>
                ) : (
                  <>
                    {availableSponsorshipCount == 1
                      ? 'You have one Token of Appre-tree-ation left to configure.'
                      : 'You do not have any available Tokens of Appre-tree-ation.'}
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
              <Grid item xs={12} sm={6} md={3} key={sponsorship.id} className={isReview ? '' : 'same-height'}>
                <SponsorshipDisplay isEditMode={true} sponsorship={sponsorship} onDelete={remove} />
                {isReview && (
                  <ReviewStatusSelect
                    value={sponsorship.reviewStatus}
                    onChange={(value: ReviewStatus) => {
                      if (value !== '') {
                        sponsorship.reviewStatus = value;
                        updateById(sponsorship.id, { reviewStatus: value });
                      }
                    }}
                    mb={2}
                  />
                )}
              </Grid>
            ))}
          </>
        )}
        {isFetched && availableSponsorshipCount > 0 && !isReview
          ? [...Array(availableSponsorshipCount)].map((_a, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} className='same-height'>
                <AddTreeButton
                  onAddClick={() => {
                    setIsAddDialogOpen(true);
                  }}
                ></AddTreeButton>
              </Grid>
            ))
          : isFetched &&
            !isReview && (
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
