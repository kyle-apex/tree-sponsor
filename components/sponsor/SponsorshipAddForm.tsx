import { User } from '.prisma/client';
import { Stepper, Step, StepButton, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import SponsorshipDisplayForm from './SponsorshipDisplayForm';
import LocationSelector from 'components/LocationSelector';
import SplitRow from 'components/layout/SplitRow';
import { FileWithContent } from 'interfaces';

const useStyles = makeStyles(theme => ({
  thumbnail: {
    width: '45px',
    height: '45px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  fullImage: {
    width: '100%',
  },
  title: {
    marginTop: '10px',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  media: {
    minHeight: '200px',
  },
  subtitle: {
    color: theme.palette.grey[600],
    //fontStyle: 'italic',
    //fontSize: theme.typography.subtitle1.fontSize,
    marginTop: '-20px',
  },
  stepButton: {
    marginTop: theme.spacing(2),
  },
}));

const SponsorshipAddForm = () => {
  const classes = useStyles();
  const [session] = useSession();

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [imageUrl, setImageUrl] = useState('');

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [isUpserting, setIsUpserting] = useState(false);

  const upsertSponsorship = async () => {
    const updatedSponsorship = await axios.post('/api/sponsorships', {
      title,
      description,
      tree: { latitude, longitude },
      imageUrl,
    });

    //router.push('/account');
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const saveStep = async (step: number) => {
    setActiveStep(step);
    setIsUpserting(true);
    await upsertSponsorship();
    setIsUpserting(false);
  };

  const steps = [{ label: 'Details' }, { label: 'Location' }];

  return (
    <>
      <Stepper nonLinear sx={{ marginBottom: 3 }} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={completed[index]}>
            <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
          </Step>
        ))}
      </Stepper>
      {activeStep == 0 && (
        <>
          <SponsorshipDisplayForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          ></SponsorshipDisplayForm>
          <SplitRow>
            <></>
            <Button
              disabled={isUpserting}
              className={classes.stepButton}
              variant='contained'
              color='primary'
              onClick={() => {
                saveStep(activeStep + 1);
              }}
            >
              Next
            </Button>
          </SplitRow>
        </>
      )}
      {activeStep == 1 && (
        <>
          <LocationSelector
            onViewportChange={({ latitude, longitude }) => {
              setLatitude(latitude), setLongitude(longitude);
            }}
          ></LocationSelector>
          <SplitRow>
            <Button
              disabled={isUpserting}
              className={classes.stepButton}
              onClick={() => {
                saveStep(activeStep - 1);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isUpserting}
              className={classes.stepButton}
              variant='contained'
              color='primary'
              onClick={() => {
                saveStep(activeStep + 1);
              }}
            >
              Next
            </Button>
          </SplitRow>
        </>
      )}
    </>
  );
};

export default SponsorshipAddForm;
