import React, { useEffect } from 'react';
/*
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
const steps = [{ label: 'Details' }, { label: 'Location' }];*/

const DetailsLocationStepper = ({ handleStep }: { handleStep?: (step: number) => void }) => {
  useEffect(() => {
    handleStep(0);
  });
  return <></>;
  /*const [completed] = useState<{ [k: number]: boolean }>({});

  return (
    <Stepper color='secondary' nonLinear sx={{ marginBottom: 3 }} activeStep={activeStep}>
      {steps.map((step, index) => (
        <Step color='secondary' key={step.label} completed={completed[index]}>
          <StepButton color='secondary' onClick={handleStep(index)} disabled={index == 1 && !tree.pictureUrl}>
            {step.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );*/
};

export default DetailsLocationStepper;
