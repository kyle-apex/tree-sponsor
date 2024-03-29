import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const isAwaitingUpload = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});
  // Helps delay saving tree while image upload is in progress
  const [saveDelayArgs, setSaveDelayArgs] = useState<Partial<{ step: number; isCompleted: boolean }>>();

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    setTree(current => {
      return { ...current, [propertyName]: value };
    });
  }, []);

  const upsertTree = async () => {
    const { w, h } = await getImageDimensions(tree.pictureUrl);
    tree.images = [{ url: tree.pictureUrl, width: w, height: h }];
    const updatedTree = await axios.post('/api/trees', { ...tree });
    if (updatedTree?.data?.id) handleChange('id', updatedTree.data.id);
    if (updatedTree?.data?.pictureUrl) {
      handleChange('pictureUrl', updatedTree.data.pictureUrl);
    }
  };

  const handleStep = (step: number) => () => {
    if (!(step == 1 && !tree.pictureUrl)) setActiveStep(step);
  };

  const saveStep = async (step: number, isCompleted?: boolean) => {
    if (isCompleted) setIsCompleting(true);
    if (isAwaitingUpload.current && isCompleted) {
      // Delay saving tree while image upload is in progress
      setSaveDelayArgs({ step, isCompleted });
      return;
    }
    setActiveStep(step);
    setIsUpserting(true);
    if (!isCompleted) isAwaitingUpload.current = true;
    await upsertTree();
    isAwaitingUpload.current = false;
    setIsUpserting(false);
    if (isCompleted) setIsCompleting(false);
    if (onComplete && isCompleted) onComplete();
  };

  // Delay saving tree while image upload is in progress
  useEffect(() => {
    if (saveDelayArgs) {
      const saveDelayTimeout = setTimeout(() => {
        const step = saveDelayArgs.step;
        const isCompleted = saveDelayArgs.isCompleted;
        setSaveDelayArgs(null);
        saveStep(step, isCompleted);
      }, 400);

      return () => {
        clearTimeout(saveDelayTimeout);
      };
    }
  }, [saveDelayArgs, tree]);

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
          {false && (
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
          )}
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
        <Box sx={{ mb: 3 }}>
          <LocationSelector
            onViewportChange={({ latitude, longitude }) => {
              handleChange('latitude', latitude);
              handleChange('longitude', longitude);
            }}
            latitude={tree?.latitude ? Number(tree?.latitude) : null}
            longitude={tree?.longitude ? Number(tree?.longitude) : null}
            zoomToLocation={!tree?.latitude}
            mapStyle='SATELLITE'
          ></LocationSelector>
        </Box>
        <SplitRow>
          <Button
            disabled={isCompleting}
            color='inherit'
            onClick={() => {
              saveStep(activeStep - 1);
            }}
          >
            Back
          </Button>
          <LoadingButton
            disabled={isCompleting}
            isLoading={isCompleting}
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
