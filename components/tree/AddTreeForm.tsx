import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import React, { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import TextField from '@mui/material/TextField';
import { PartialTree } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

const steps = [{ label: 'Details' }, { label: 'Location' }];

const AddTreeForm = ({ onComplete }: { onComplete: () => void }) => {
  const [tree, setTree] = useState<PartialTree>({});
  const [isUpserting, setIsUpserting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    setTree({ ...tree, [propertyName]: value });
  }, []);

  const upsertTree = () => {
    onComplete();
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
          <Typography sx={{ marginBottom: 2 }} variant='h6' color='secondary'>
            Optional Details
          </Typography>
          <SpeciesSelector onChange={speciesId => handleChange('speciesId', speciesId)}></SpeciesSelector>
          <TextField
            sx={{ marginBottom: 3, marginTop: 2 }}
            label='Name/Nickname (ex: The Treaty Oak)'
            onChange={e => handleChange('name', e.target.value)}
          ></TextField>
          <Typography sx={{ marginBottom: 2 }} color='secondary' variant='h6'>
            Advanced Details
          </Typography>
          <TextField
            sx={{ marginBottom: 2 }}
            label='Height Estimation (feet)'
            onChange={e => handleChange('height', e.target.value)}
            type='number'
          ></TextField>
          <TextField
            sx={{ marginBottom: 2 }}
            label='Diameter (inches)'
            onChange={e => handleChange('diameter', e.target.value)}
            type='number'
          ></TextField>
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
