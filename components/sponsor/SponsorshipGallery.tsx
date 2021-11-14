import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import useTheme from '@mui/styles/useTheme';
import React, { useState } from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';
import { PartialSponsorship } from 'interfaces';
import SponsorshipDisplay from './SponsorshipDisplay';
import Box from '@mui/system/Box';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const SponsorshipGallery = ({ sponsorships }: { sponsorships: PartialSponsorship[] }) => {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = sponsorships.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => {
      const newStep = prevActiveStep + 1;
      return newStep; // >= 3 ? 0 : newStep;
    });
  };

  const slideRenderer = (params: { index: number; key: React.Key }) => {
    const { index, key } = params;
    const sponsorship = sponsorships[mod(index, maxSteps)];
    return <SponsorshipDisplay key={key} sponsorship={sponsorship}></SponsorshipDisplay>;
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => {
      const newStep = prevActiveStep - 1;
      return newStep; // < 0 ? 2 : newStep;
    });
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <MobileStepper
          sx={{
            paddingTop: '3px',
            paddingBottom: '0px',
            boxShadow: '2px -1px 3px -2px rgb(0 0 0 / 12%)',
            marginRight: '1px',
          }}
          steps={maxSteps}
          position='static'
          activeStep={mod(activeStep, maxSteps)}
          nextButton={
            <Button size='small' onClick={handleNext}>
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size='small' onClick={handleBack}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </Button>
          }
        />
      </Box>
      <VirtualizeSwipeableViews
        style={{
          marginTop: '-5px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingBottom: '3px',
        }}
        slideRenderer={slideRenderer}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      />
    </>
  );
};
export default SponsorshipGallery;
