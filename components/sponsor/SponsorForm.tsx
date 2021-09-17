import { Box, Button, Grid, makeStyles, Step, StepButton, Stepper, TextField } from '@material-ui/core';
import UploadButton from '@rpldy/upload-button';
import Uploady from '@rpldy/uploady';
import axios from 'axios';
import LocationSelector from 'components/LocationSelector';
import { useSession } from 'next-auth/client';
import React, { useEffect, useState, useRef } from 'react';
import TreeDetails from './TreeDetails';
import { flexbox } from '@material-ui/system';
import SplitRow from 'components/layout/SplitRow';
import { AccessAlarm, ThreeDRotation, NaturePeopleSharp } from '@material-ui/icons';

const filterBySize = (file: any) => {
  //filter out images larger than 15MB
  return file.size <= 15242880;
};

const useStyles = makeStyles(theme => ({
  hidden: {
    display: 'none',
  },
  stepButton: {
    marginTop: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    height: '200px',
    marginTop: theme.spacing(2),
    display: 'block',
  },
}));

const steps = [
  { label: 'Location', icon: <AccessAlarm /> },
  { label: 'Picture', icon: <AccessAlarm /> },
  { label: 'Details', icon: <AccessAlarm /> },
];

const SponsorForm = () => {
  const fileInputRef = useRef<HTMLInputElement>();
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const [session] = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [imageFile, setImageFile] = useState<{ type: string; content: string }>();
  const [imageUrl, setImageUrl] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const handleTitleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setTitle(event.target.value);
  };
  const createSponsorship = () => {
    axios.post('/api/sponsorships', {
      title,
      description,
      tree: { latitude, longitude },
      imageFile,
    });
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('inonselectfile');
    if (!e?.target?.files?.length) return;
    const reader = new FileReader();
    const file = e.target.files[0];

    // Read the image via FileReader API and save image result in state.
    reader.onload = function (e) {
      // Add the file name to the data URL
      //console.log(e.target.result);
      const imageUrl = String(e.target.result);
      setImageUrl(imageUrl);
      setImageFile({ type: file.type, content: imageUrl.split(',')[1] });
    };
    reader.readAsDataURL(file);
  };

  const getSubscriptions = async () => {
    setSubscriptions(await axios.get('/api/availableSponsorships'));
  };

  useEffect(() => {
    getSubscriptions();
  }, []);
  return (
    <form>
      <Grid container direction='column'>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepButton onClick={handleStep(index)} completed={completed[index]}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        {activeStep == 0 && (
          <>
            <LocationSelector
              onViewportChange={({ latitude, longitude }) => {
                setLatitude(latitude), setLongitude(longitude);
              }}
            ></LocationSelector>
            <SplitRow>
              <></>
              <Button
                className={classes.stepButton}
                variant='contained'
                color='primary'
                onClick={() => {
                  setActiveStep(activeStep + 1);
                }}
              >
                Next
              </Button>
            </SplitRow>
          </>
        )}

        {activeStep == 1 && (
          <>
            <input type='file' ref={fileInputRef} accept='image/*' className={classes.hidden} onChange={onSelectFile} />
            <Button
              className={classes.uploadButton}
              variant='outlined'
              color='secondary'
              onClick={() => {
                fileInputRef?.current?.click();
              }}
            >
              <NaturePeopleSharp color='secondary' fontSize='large' />
              <div>Upload Image</div>
            </Button>
            {imageUrl && (
              <div>
                <p>Preview:</p>
                <img width='100%' src={imageUrl} />
              </div>
            )}
            <SplitRow>
              <Button
                className={classes.stepButton}
                onClick={() => {
                  setActiveStep(activeStep - 1);
                }}
              >
                Back
              </Button>
              <Button
                className={classes.stepButton}
                variant='contained'
                color='primary'
                onClick={() => {
                  setActiveStep(activeStep + 1);
                }}
              >
                Next
              </Button>
            </SplitRow>
          </>
        )}
        {activeStep == 2 && (
          <>
            <TextField label='Title' variant='filled' onChange={handleTitleChange}></TextField>
            <TextField
              label='Description'
              variant='filled'
              value={description}
              className={classes.description}
              multiline
              rows={3}
              onChange={event => {
                setDescription(event.target.value);
              }}
            ></TextField>
            <SplitRow>
              <Button
                className={classes.stepButton}
                onClick={() => {
                  setActiveStep(activeStep - 1);
                }}
              >
                Back
              </Button>
              <Button
                className={classes.stepButton}
                variant='contained'
                color='primary'
                onClick={() => {
                  createSponsorship();
                }}
              >
                Start Sponsorship
              </Button>
            </SplitRow>

            <TreeDetails
              detail={{
                title: title || 'Title Preview',
                description: description || 'Preview of your description',
                pictureUrl: imageUrl,
                user: session?.user,
                startDate: new Date(),
              }}
            ></TreeDetails>
          </>
        )}
      </Grid>
    </form>
  );
};
export default SponsorForm;
