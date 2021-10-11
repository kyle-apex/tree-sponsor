import { Stepper, Step, StepButton, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import axios from 'axios';
import SponsorshipDisplayForm from './SponsorshipDisplayForm';
import LocationSelector from 'components/LocationSelector';
import SplitRow from 'components/layout/SplitRow';
import { PartialSponsorship } from 'interfaces';

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

const SponsorshipAddForm = ({ sponsorship, onComplete }: { sponsorship?: PartialSponsorship; onComplete?: () => void }) => {
  const classes = useStyles();
  const [session] = useSession();

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [id, setId] = useState(0);

  const [imageUrl, setImageUrl] = useState('');

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [isUpserting, setIsUpserting] = useState(false);

  const upsertSponsorship = async () => {
    const updatedSponsorship = await axios.post('/api/sponsorships', {
      id,
      title,
      description,
      tree: { latitude, longitude },
      imageUrl,
    });

    console.log('updatedSponsorship.data', updatedSponsorship.data, updatedSponsorship);

    if (updatedSponsorship?.data?.id) setId(updatedSponsorship.data.id);
    //router.push('/account');
  };

  const handleStep = (step: number) => () => {
    if (!(step == 1 && !imageUrl)) setActiveStep(step);
  };

  const saveStep = async (step: number) => {
    setActiveStep(step);
    setIsUpserting(true);
    await upsertSponsorship();
    setIsUpserting(false);
    if (onComplete) onComplete();
  };

  const steps = [{ label: 'Details' }, { label: 'Location' }];

  useEffect(() => {
    if (sponsorship) {
      setTitle(sponsorship.title);
      setDescription(sponsorship.description);
      setId(sponsorship.id);
      setImageUrl(sponsorship.pictureUrl);
      if (sponsorship.tree?.latitude) {
        setLatitude(Number(sponsorship.tree.latitude));
        setLongitude(Number(sponsorship.tree.longitude));
      }
    }
  }, [sponsorship]);

  return (
    <>
      <Stepper color='secondary' nonLinear sx={{ marginBottom: 3 }} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step color='secondary' key={step.label} completed={completed[index]}>
            <StepButton color='secondary' sx={{ color: 'red' }} onClick={handleStep(index)} disabled={index == 1 && !imageUrl}>
              {step.label}
            </StepButton>
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
            {onComplete ? (
              <Button
                disabled={isUpserting}
                className={classes.stepButton}
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
            <Button
              disabled={isUpserting || !imageUrl}
              className={classes.stepButton}
              variant='contained'
              color='primary'
              onClick={() => {
                saveStep(activeStep + 1);
              }}
            >
              Save and Continue
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
            latitude={sponsorship?.tree?.latitude ? Number(sponsorship?.tree?.latitude) : null}
            longitude={sponsorship?.tree?.longitude ? Number(sponsorship?.tree?.longitude) : null}
          ></LocationSelector>
          <SplitRow>
            <Button
              disabled={isUpserting}
              className={classes.stepButton}
              color='inherit'
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
              Save and Finish
            </Button>
          </SplitRow>
        </>
      )}
    </>
  );
};

export default SponsorshipAddForm;
