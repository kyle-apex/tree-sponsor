import React, { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import LoadingButton from 'components/LoadingButton';
import { PartialUser } from 'interfaces';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import ErrorText from 'components/form/ErrorText';
import parsedGet from 'utils/api/parsed-get';
import LaunchIcon from '@mui/icons-material/Launch';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { Prisma } from '@prisma/client';
import { useGet } from 'utils/hooks/use-get';
import Skeleton from '@mui/material/Skeleton';
import CenteredSection from 'components/layout/CenteredSection';
import InputAdornment from '@mui/material/InputAdornment';
const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <>
      <Skeleton variant='text' sx={{ width: '15%' }} />
      <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 3 }} height={100} />
    </>
  ),
});

const EditProfile = ({ children }: { children?: ReactNode }): JSX.Element => {
  const { data: user, isFetched } = useGet<PartialUser>('/api/me', 'me');
  const [name, setName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [linkedInLink, setLinkedInLink] = useState('');
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
  const userRef = useRef<PartialUser>();
  const bioRef = useRef<string>();

  useEffect(() => {
    if (!isFetched || !user) return;
    if (user.name) setName(user.name);
    const profile = user.profile;
    if (profile) {
      if (profile.twitterHandle) setTwitterHandle(profile.twitterHandle);
      if (profile.instagramHandle) setInstagramHandle(profile.instagramHandle);
      if (profile.linkedInLink) setLinkedInLink(profile.linkedInLink);
    }

    bioRef.current = user?.profile?.bio;

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
  }, [isFetched]);

  const handleNameChange = (event: { target: { value: string } }) => {
    setIsChanged(true);
    setName(event.target.value);
  };

  const handleBioChange = useCallback((newValue: string) => {
    if (newValue != bioRef.current) setIsChanged(true);
    bioRef.current = newValue;
  }, []);

  const handleProfilePathChange = async (event: { target: { value: string } }) => {
    setIsChanged(true);
    const profilePath = event.target.value;
    const hasPatternError = !/^[a-z-]+$/.test(profilePath);
    setProfilePathState(state => {
      return { ...state, profilePath, hasPatternError };
    });
    if (profilePath != profilePathState.initialValue && !hasPatternError) {
      const isDuplicate = (await parsedGet(`/api/users/${user.id}/is-duplicate-profile-path?profilePath=${profilePath}`)) as boolean;
      setProfilePathState(state => {
        return { ...state, isDuplicate };
      });
    }
  };

  const updateUser = async () => {
    setIsLoading(true);

    const prismaUpdateQuery: Prisma.UserUpdateInput = { name, image: imageUrl, profilePath: profilePathState.profilePath };

    const bio = bioRef.current;

    if (
      bio !== user.profile?.bio ||
      user.profile?.instagramHandle !== instagramHandle ||
      user.profile?.twitterHandle !== twitterHandle ||
      user.profile?.linkedInLink !== linkedInLink
    ) {
      prismaUpdateQuery.profile = {
        upsert: {
          create: {
            bio,
            linkedInLink,
            twitterHandle,
            instagramHandle,
          },
          update: {
            bio,
            linkedInLink,
            twitterHandle,
            instagramHandle,
          },
        },
      };
    }

    await axios.patch('/api/me', prismaUpdateQuery);
    setIsLoading(false);
    setIsChanged(false);
  };

  return (
    <CenteredSection>
      <SplitRow>
        {children}
        <a href={'/u/' + profilePathState.profilePath} target='_blank' style={{ textDecoration: 'none' }} rel='noreferrer'>
          <Button variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
            <span>Launch Profile</span> <LaunchIcon sx={{ marginLeft: 1, fontSize: '1rem' }} />
          </Button>
        </a>
      </SplitRow>
      {isFetched ? (
        <>
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

          <TextField
            value={name}
            onChange={handleNameChange}
            label='Name'
            size='small'
            sx={{ marginBottom: 3 }}
            id='name-field'
          ></TextField>
          <TextField
            value={instagramHandle}
            onChange={e => {
              setIsChanged(true);
              setInstagramHandle(e.target.value);
            }}
            label='Instagram Handle'
            size='small'
            sx={{ marginBottom: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>@</InputAdornment>,
            }}
            id='instagram-field'
          ></TextField>
          <TextField
            value={twitterHandle}
            onChange={e => {
              setIsChanged(true);
              setTwitterHandle(e.target.value);
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>@</InputAdornment>,
            }}
            label='Twitter Handle'
            size='small'
            sx={{ marginBottom: 3 }}
            id='twitter-field'
          ></TextField>
          <TextField
            value={linkedInLink}
            onChange={e => {
              setIsChanged(true);
              setLinkedInLink(e.target.value);
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>linkedin.com/in/</InputAdornment>,
            }}
            label='LinkedIn Link'
            size='small'
            sx={{ marginBottom: 3 }}
            id='linkedin-field'
          ></TextField>
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

          <Box sx={{ marginBottom: 3, minHeight: '110px', display: 'block' }}>
            <TextEditor
              label='Bio'
              placeholder='Enter a short bio to display on your profile...'
              value={user?.profile?.bio}
              onChange={handleBioChange}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ marginBottom: 3 }}>
          <Box
            sx={{
              marginBottom: 2,
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
              }}
            >
              <Skeleton variant='circular' width={50} height={50} />
            </Box>

            <Skeleton variant='text' sx={{ width: '100%' }} />
          </Box>
          <Skeleton variant='text' sx={{ width: '15%' }} />
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={30} />
          <Skeleton variant='text' sx={{ width: '15%' }} />
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={30} />
          <Skeleton variant='text' sx={{ width: '15%' }} />
          <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 2 }} height={100} />
        </Box>
      )}
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
    </CenteredSection>
  );
};

export default EditProfile;
