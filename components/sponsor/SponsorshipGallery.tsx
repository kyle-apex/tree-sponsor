import { Button, MobileStepper, useTheme } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';
import { PartialSponsorship } from 'interfaces';
import SponsorshipDisplay from './SponsorshipDisplay';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const SponsorshipGallery = ({ sponsorships }: { sponsorships: PartialSponsorship[] }) => {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 3;

  const handleNext = () => {
    setActiveStep(prevActiveStep => {
      const newStep = prevActiveStep + 1;
      return newStep; // >= 3 ? 0 : newStep;
    });
  };

  const slideRenderer = (params: { index: number; key: any }) => {
    const { index, key } = params;
    const sponsorship = sponsorships[mod(index, 3)];
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
      <MobileStepper
        sx={{ paddingTop: '3px', paddingBottom: '0px' }}
        steps={maxSteps}
        position='static'
        activeStep={mod(activeStep, 3)}
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
      <VirtualizeSwipeableViews
        style={{ marginTop: '-5px' }}
        slideRenderer={slideRenderer}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      />
      {false && (
        <SwipeableViews axis='x' index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
          {sponsorships.map(sponsorship => (
            <SponsorshipDisplay key={sponsorship.id} sponsorship={sponsorship}></SponsorshipDisplay>
          ))}
        </SwipeableViews>
      )}
    </>
  );
};
export default SponsorshipGallery;