import React, { useState, useCallback } from 'react';
import { PartialTree } from 'interfaces';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

import axios from 'axios';
import AddTreeFormFields from './AddTreeFormFields';
import Box from '@mui/material/Box';
import LocationSelector from 'components/LocationSelector';
import getImageDimensions from 'utils/aws/get-image-dimensions';

const steps = [{ label: 'Details' }, { label: 'Location' }];

const AddTreeForm = ({ onComplete }: { onComplete: () => void }) => {
  const [tree, setTree] = useState<PartialTree>({});
  const [isUpserting, setIsUpserting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    //console.log('handleChange', propertyName, value);
    //console.log('tree', tree);
    //const newTree = { ...tree, [propertyName]: value };

    setTree(current => {
      return { ...current, [propertyName]: value };
    });
    //console.log('newTree', newTree);
  }, []);

  const upsertTree = async () => {
    const { w, h } = await getImageDimensions(tree.pictureUrl);
    tree.images = [{ url: tree.pictureUrl, width: w, height: h }];
    const updatedTree = await axios.post('/api/trees', { ...tree });
    if (updatedTree?.data?.id) handleChange('id', updatedTree.data.id);
  };

  const handleStep = (step: number) => () => {
    if (!(step == 1 && !tree.pictureUrl)) setActiveStep(step);
  };

  const saveStep = async (step: number, isCompleted?: boolean) => {
    setActiveStep(step);
    setIsUpserting(true);
    await upsertTree();
    setIsUpserting(false);
    if (onComplete && isCompleted) onComplete();
  };

  return (
    <>
      <Stepper color='secondary' nonLinear sx={{ marginBottom: 3 }} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step color='secondary' key={step.label} completed={completed[index]}>
            <StepButton color='secondary' onClick={handleStep(index)} disabled={index == 1 && !tree.pictureUrl}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
        <AddTreeFormFields tree={tree} handleChange={handleChange}></AddTreeFormFields>
        <SplitRow>
          {onComplete ? (
            <Button
              disabled={isUpserting}
              color='inherit'
              onClick={() => {
                onComplete();
              }}
            >
              Cancel
            </Button>
          ) : (
            <></>
          )}
          <LoadingButton
            disabled={isUpserting || !tree.pictureUrl}
            variant='contained'
            color='secondary'
            isLoading={isUpserting}
            onClick={() => {
              saveStep(activeStep, true);
            }}
          >
            Save
          </LoadingButton>
          <Button
            disabled={isUpserting || !tree.pictureUrl}
            variant='contained'
            color='primary'
            onClick={() => {
              saveStep(activeStep + 1);
            }}
          >
            Save & Continue
          </Button>
        </SplitRow>
      </Box>
      <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
        <LocationSelector
          onViewportChange={({ latitude, longitude }) => {
            handleChange('latitude', latitude);
            handleChange('longitude', longitude);
          }}
          latitude={tree?.latitude ? Number(tree?.latitude) : null}
          longitude={tree?.longitude ? Number(tree?.longitude) : null}
          auto={!tree?.latitude}
        ></LocationSelector>
        <SplitRow>
          <Button
            disabled={isUpserting}
            color='inherit'
            onClick={() => {
              saveStep(activeStep - 1);
            }}
          >
            Back
          </Button>
          <LoadingButton
            disabled={isUpserting}
            isLoading={isUpserting}
            variant='contained'
            color='primary'
            onClick={() => {
              saveStep(activeStep, true);
            }}
          >
            Save and Finish
          </LoadingButton>
        </SplitRow>
      </Box>
    </>
  );
};

export default AddTreeForm;
