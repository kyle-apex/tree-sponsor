import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import React, { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import { PartialTree } from 'interfaces';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

import axios from 'axios';
import AddTreeFormFields from './AddTreeFormFields';

const steps = [{ label: 'Details' }, { label: 'Location' }];

const AddTreeForm = ({ onComplete }: { onComplete: () => void }) => {
  const [tree, setTree] = useState<PartialTree>({});
  const [isUpserting, setIsUpserting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    setTree({ ...tree, [propertyName]: value });
  }, []);

  const upsertTree = async () => {
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
      <Card>
        <CardMedia
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f1f1f1',
            cursor: 'pointer',
            minHeight: '200px',
          }}
          component='div'
          title='Click to Update Image'
        >
          <ImageUploadAndPreview
            imageUrl={tree.pictureUrl}
            setImageUrl={(imageUrl: string) => {
              handleChange('imageUrl', imageUrl);
            }}
          />
        </CardMedia>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <AddTreeFormFields tree={tree} handleChange={handleChange}></AddTreeFormFields>
        </CardContent>
        <CardActions>
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
        </CardActions>
      </Card>
    </>
  );
};

export default AddTreeForm;
