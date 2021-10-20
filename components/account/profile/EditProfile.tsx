import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updateUser } from 'utils/prisma/update-user';
import axios from 'axios';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import LoadingButton from 'components/LoadingButton';

const EditProfile = () => {
  //const [session, setSession] = useState<Session>();

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const readSession = async () => {
    const session = await getSession();
    if (session?.user.name) setName(session.user.name);
    if (session?.user.image) setImageUrl(session.user.image);
  };

  useEffect(() => {
    readSession();
  }, []);

  const handleNameChange = (event: { target: { value: any } }) => {
    //setSession(Object.assign(session, { name: event.target.value }));
    setName(event.target.value);
  };

  const updateUser = async () => {
    setIsLoading(true);
    await axios.patch('/api/me', { name, image: imageUrl });
    setIsLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
      <Box
        sx={{
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          padding: '8px 12px',
          borderRadius: '5px',
          background: 'white',
          borderColor: 'rgba(0, 0, 0, 0.23)',
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            height: '50px',
            width: '50px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
          }}
        >
          <ImageUploadAndPreview
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            maxHeight={250}
            maxWidth={250}
            size='small'
            hideEditButton={true}
          ></ImageUploadAndPreview>
        </Box>
        <Typography variant='subtitle2'>Click the image to update your profile picture</Typography>
      </Box>

      <TextField value={name} onChange={handleNameChange} label='Name' size='small' sx={{ marginBottom: 2 }}></TextField>
      <LoadingButton variant='contained' onClick={updateUser} isLoading={isLoading}>
        Save
      </LoadingButton>
    </Box>
  );
};

export default EditProfile;
