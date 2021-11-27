import React, { ReactNode, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import LoadingButton from 'components/LoadingButton';
import { getSession } from 'utils/auth/get-session';
import { Session } from 'interfaces';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import ErrorText from 'components/form/ErrorText';
import parsedGet from 'utils/api/parsed-get';
import LaunchIcon from '@mui/icons-material/Launch';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
const TextEditor = dynamic(() => import('components/TextEditor'), { ssr: false });

const EditProfile = ({ children }: { children?: ReactNode }): JSX.Element => {
  const [name, setName] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [profilePathState, setProfilePathState] = useState({
    profilePath: '',
    isLoading: false,
    isDuplicate: false,
    initialValue: '',
    hasPatternError: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const session = useRef<Session>();

  const readSession = async () => {
    session.current = await getSession();
    const user = session.current.user;
    if (user.name) setName(user.name);
    if (user.profilePath)
      setProfilePathState(state => {
        return { ...state, profilePath: user.profilePath, initialValue: user.profilePath };
      });
    else {
      const profilePath = generateProfilePath(user);
      setProfilePathState(state => {
        return { ...state, profilePath };
      });
      axios.patch('/api/me', { profilePath });
    }
    if (user.image) setImageUrl(user.image);
  };

  useEffect(() => {
    readSession();
  }, []);

  const handleNameChange = (event: { target: { value: string } }) => {
    setIsChanged(true);
    setName(event.target.value);
  };

  const handleProfilePathChange = async (event: { target: { value: string } }) => {
    setIsChanged(true);
    const profilePath = event.target.value;
    const hasPatternError = !/^[a-z-]+$/.test(profilePath);
    setProfilePathState(state => {
      return { ...state, profilePath, hasPatternError };
    });
    if (profilePath != profilePathState.initialValue && !hasPatternError) {
      const isDuplicate = (await parsedGet(
        `/api/users/${session.current.user.id}/is-duplicate-profile-path?profilePath=${profilePath}`,
      )) as boolean;
      setProfilePathState(state => {
        return { ...state, isDuplicate };
      });
    }
  };

  const updateUser = async () => {
    setIsLoading(true);
    await axios.patch('/api/me', { name, image: imageUrl, profilePath: profilePathState.profilePath });
    setIsLoading(false);
    setIsChanged(false);
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
      <SplitRow>
        {children}
        <a href={'/u/' + profilePathState.profilePath} target='_blank' style={{ textDecoration: 'none' }} rel='noreferrer'>
          <Button variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
            <span>Launch Profile</span> <LaunchIcon sx={{ marginLeft: 1, fontSize: '1rem' }} />
          </Button>
        </a>
      </SplitRow>
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
            flex: '0 0 50px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
          }}
        >
          <ImageUploadAndPreview
            imageUrl={imageUrl}
            setImageUrl={newImageUrl => {
              setIsChanged(true);
              setImageUrl(newImageUrl);
            }}
            maxHeight={250}
            maxWidth={250}
            size='small'
            hideEditButton={true}
          ></ImageUploadAndPreview>
        </Box>

        <Typography variant='subtitle2'>Click the image to update your profile picture.</Typography>
      </Box>

      <TextField value={name} onChange={handleNameChange} label='Name' size='small' sx={{ marginBottom: 3 }} id='name-field'></TextField>
      <TextField
        value={profilePathState.profilePath}
        onChange={handleProfilePathChange}
        label='Profile Path'
        size='small'
        inputProps={{ pattern: '[a-z-]' }}
        sx={{ marginBottom: 3 }}
        error={profilePathState.isDuplicate || profilePathState.hasPatternError}
        spellCheck='false'
        id='profile-path-field'
      ></TextField>
      {profilePathState.hasPatternError && <ErrorText>Profile Path must only contain lower case letters and &quot;-&quot;</ErrorText>}
      {profilePathState.isDuplicate && <ErrorText>Profile Path is already in use</ErrorText>}
      <Box sx={{ marginBottom: 3 }}>
        <TextEditor label='Bio' />
      </Box>
      <LoadingButton
        variant='contained'
        disabled={profilePathState.isDuplicate || profilePathState.hasPatternError || !isChanged}
        onClick={updateUser}
        isLoading={isLoading}
      >
        Save
      </LoadingButton>
      <Typography sx={{ color: theme => theme.palette.grey[600] }} variant='body2' mt={2} mb={-1}>
        Profile updates will appear across the site after clicking &quot;Save&quot; and refreshing the page.
      </Typography>
    </Box>
  );
};

export default EditProfile;
