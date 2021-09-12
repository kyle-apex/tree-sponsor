import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import UploadButton from '@rpldy/upload-button';
import Uploady from '@rpldy/uploady';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import React, { useEffect, useState, useRef } from 'react';
import TreeDetails from './TreeDetails';

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
        <section>
          <TreeDetails
            detail={{
              title: title || 'Title Preview',
              description: description || 'Preview of your description',
              pictureUrl: imageUrl,
              user: session?.user,
              startDate: new Date(),
            }}
          ></TreeDetails>
        </section>
      </Grid>
    </form>
  );
};
export default SponsorForm;
