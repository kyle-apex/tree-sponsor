import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import UploadButton from '@rpldy/upload-button';
import Uploady from '@rpldy/uploady';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

const filterBySize = (file: any) => {
  //filter out images larger than 15MB
  return file.size <= 15242880;
};

const useStyles = makeStyles(theme => ({
  hidden: {
    display: 'none',
  },
}));

const SponsorForm = () => {
  const fileInputRef = useRef();
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [imageFileContent, setImageFileContent] = useState('');
  const [imageFileType, setImageFileType] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const handleTitleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setTitle(event.target.value);
  };
  const createSponsorship = () => {
    axios.post('/api/sponsorships', {
      title,
      description,
      tree: { latitude, longitude },
      imageFileContent,
      imageFileType,
    });
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
      setImageFileContent(String(e.target.result).split(',')[1]);
    };
    setImageFileType(file.type);
    reader.readAsDataURL(file);
  };

  useEffect(async () => {
    setSubscriptions(await axios.get('/api/availableSponsorships'));
  }, []);
  return (
    <form>
      <Grid container direction='column'>
        <TextField label='Title' variant='filled' onChange={handleTitleChange}></TextField>
        <TextField
          label='Description'
          variant='filled'
          multiline
          rows={3}
          onChange={event => {
            setDescription(event.target.value);
          }}
        ></TextField>
        <TextField
          label='Latitude'
          variant='filled'
          type='number'
          onChange={event => {
            setLatitude(Number(event.target.value));
          }}
        ></TextField>
        <TextField
          label='Longitude'
          variant='filled'
          type='number'
          onChange={event => {
            setLongitude(Number(event.target.value));
          }}
        ></TextField>
        <input type='file' ref={fileInputRef} accept='image/*' className={classes.hidden} onChange={onSelectFile} />
        <Button
          variant='outlined'
          onClick={() => {
            fileInputRef?.current && fileInputRef.current.click();
          }}
        >
          Upload Image
        </Button>
        <Button
          variant='outlined'
          onClick={() => {
            createSponsorship();
          }}
        >
          Start Sponsorship
        </Button>
      </Grid>
    </form>
  );
};
export default SponsorForm;
