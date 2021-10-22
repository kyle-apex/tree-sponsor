import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import LoadingButton from 'components/LoadingButton';

const EditProfile = (): JSX.Element => {
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

  const handleNameChange = (event: { target: { value: string } }) => {
    setName(event.target.value);
  };

  const updateUser = async () => {
    setIsLoading(true);
    await axios.patch('/api/me', { name, image: imageUrl });
    setIsLoading(false);
  };

  return (
    <Box
      className='section-background box-shadow'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: theme => theme.palette.primary.main,
        borderRadius: '5px',
        border: 'solid 1px',
        padding: '10px 20px 30px',
      }}
    >
      <Box
        sx={{
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          padding: '8px 12px',
          borderRadius: '5px',
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
        <Typography variant='subtitle2'>Click the image to update your profile picture.</Typography>
      </Box>

      <TextField value={name} onChange={handleNameChange} label='Name' size='small' sx={{ marginBottom: 2 }}></TextField>
      <LoadingButton variant='contained' onClick={updateUser} isLoading={isLoading}>
        Save
      </LoadingButton>
      <Typography sx={{ color: theme => theme.palette.grey[600] }} variant='body2' mt={2} mb={-1}>
        Profile updates will appear across the site after clicking &quot;Save&quot; and refreshing the page.
      </Typography>
    </Box>
  );
};

export default EditProfile;
