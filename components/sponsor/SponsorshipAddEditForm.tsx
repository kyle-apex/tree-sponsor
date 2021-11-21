import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SponsorshipDisplayForm from './SponsorshipDisplayForm';
import LocationSelector from 'components/LocationSelector';
import SplitRow from 'components/layout/SplitRow';
import { PartialSponsorship } from 'interfaces';
import LoadingButton from 'components/LoadingButton';

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

async function getImageDimensions(file: string): Promise<{ w: number; h: number }> {
  return new Promise(function (resolved) {
    const t2 = new Date().getTime();
    const i = new Image();
    i.onload = function () {
      console.log('newtime', t2 - new Date().getTime());
      resolved({ w: i.width, h: i.height });
    };
    i.src = file;
  });
}

const SponsorshipAddEditForm = ({
  sponsorship,
  onComplete,
  setSponsorship,
}: {
  sponsorship?: PartialSponsorship;
  onComplete?: () => void;
  setSponsorship?: React.Dispatch<React.SetStateAction<PartialSponsorship>>;
}) => {
  const classes = useStyles();

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [id, setId] = useState(0);
  const [primaryImageUuid, setPrimaryImageUuid] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});
  const [isUpserting, setIsUpserting] = useState(false);

  const handleImageUrl: Dispatch<SetStateAction<string>> = (imageUrl: SetStateAction<string>) => {
    const url = imageUrl as string;

    setImageUrl(url);
    setImageDimensions(url);
  };

  const setImageDimensions = async (imageUrl: string) => {
    const { w, h } = await getImageDimensions(imageUrl);
    setImageWidth(w);
    setImageHeight(h);
  };

  const upsertSponsorship = async () => {
    if (setSponsorship) setSponsorship(Object.assign(sponsorship, { title, description, isPrivate }));

    const updatedSponsorship = await axios.post('/api/sponsorships', {
      id,
      title,
      description,
      isPrivate,
      primaryImageUuid,
      primaryImageHeight: imageHeight,
      primaryImageWidth: imageWidth,
      tree: { latitude, longitude },
      imageUrl,
    });

    if (updatedSponsorship?.data?.id) setId(updatedSponsorship.data.id);
  };

  const handleStep = (step: number) => () => {
    if (!(step == 1 && !imageUrl)) setActiveStep(step);
  };

  const saveStep = async (step: number, isCompleted?: boolean) => {
    setActiveStep(step);
    setIsUpserting(true);
    await upsertSponsorship();
    setIsUpserting(false);
    if (onComplete && isCompleted) onComplete();
  };

  const steps = [{ label: 'Details' }, { label: 'Location' }];

  useEffect(() => {
    if (sponsorship) {
      setTitle(sponsorship.title);
      setDescription(sponsorship.description);
      setIsPrivate(sponsorship.isPrivate);
      setId(sponsorship.id);
      setPrimaryImageUuid(sponsorship.primaryImageUuid);
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
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            imageUrl={imageUrl}
            setImageUrl={handleImageUrl}
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
            <LoadingButton
              disabled={isUpserting || !imageUrl}
              className={classes.stepButton}
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
              disabled={isUpserting || !imageUrl}
              className={classes.stepButton}
              variant='contained'
              color='primary'
              onClick={() => {
                saveStep(activeStep + 1);
              }}
            >
              Save & Continue
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
            auto={!sponsorship?.tree?.latitude}
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
            <LoadingButton
              disabled={isUpserting}
              isLoading={isUpserting}
              className={classes.stepButton}
              variant='contained'
              color='primary'
              onClick={() => {
                saveStep(activeStep, true);
              }}
            >
              Save and Finish
            </LoadingButton>
          </SplitRow>
        </>
      )}
    </>
  );
};

export default SponsorshipAddEditForm;
