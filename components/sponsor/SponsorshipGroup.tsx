import Grid, { GridSize } from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/system/Box';
import useTheme from '@mui/system/useTheme';
import React from 'react';
import SponsorshipDisplayLoading from './SponsorshipDisplayLoading';
import SponsorshipDisplay from './SponsorshipDisplay';
import SponsorshipGallery from './SponsorshipGallery';
import { PartialSponsorship } from 'interfaces';

const SponsorshipGroup = ({
  isLoading,
  sponsorships,
  columnWidth = 4,
}: {
  isLoading: boolean;
  sponsorships: PartialSponsorship[];
  columnWidth?: GridSize;
}) => {
  const theme = useTheme();
  const hasGallery = !useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Grid mb={12} container spacing={5} direction='row' justifyContent='space-around' alignItems='stretch'>
      {isLoading &&
        !hasGallery &&
        [...Array(3)].map((_item, index) => (
          <Grid md={columnWidth} key={index} item>
            <SponsorshipDisplayLoading />
          </Grid>
        ))}
      {!isLoading &&
        !hasGallery &&
        sponsorships.map(sponsorship => (
          <Grid md={columnWidth} key={sponsorship.id} item className='start'>
            <SponsorshipDisplay sponsorship={sponsorship}></SponsorshipDisplay>
          </Grid>
        ))}
      {hasGallery && (
        <Grid item xs={12} justifyContent='center'>
          {!isLoading && <SponsorshipGallery sponsorships={sponsorships} />}
          {isLoading && (
            <Box sx={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              <SponsorshipDisplayLoading />
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default SponsorshipGroup;
