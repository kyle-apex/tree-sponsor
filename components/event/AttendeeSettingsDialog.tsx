import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { PartialUser } from 'interfaces';
import { signIn, signOut, SignOutParams, useSession } from 'next-auth/client';
import AttendeeContactForm from './AttendeeContactForm';
import { useRef, useState, useCallback } from 'react';
import Checkbox from '@mui/material/Checkbox';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import { Prisma } from 'utils/prisma/init';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';
type booleanFunc = (isOpen: boolean) => void;
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

const AttendeeSettingsDialog = ({
  isOpen,
  setIsOpen,
  isPrivate,
  user,
  onSetIsPrivate,
  simplifiedMode = false,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | booleanFunc;
  isPrivate: boolean;
  onSetIsPrivate?: () => void;
  user: PartialUser;
  simplifiedMode?: boolean;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };
  const [profile, setProfile] = useState(user?.profile);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(user?.image);
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name);

  const imageUploadRef = useRef<React.ElementRef<typeof ImageUploadAndPreview>>(null);

  const [session] = useSession();
  const params: SignOutParams = {};

  const setIsPrivate = async (isPrivate: boolean) => {
    await onSetIsPrivate();
    const message = isPrivate ? 'Checkin hidden' : 'Checkin visible';
    setSnackbarMessage(message);
  };
  const save = async () => {
    setIsSaving(true);
    const prismaUpdateQuery: Prisma.UserUpdateInput = {
      image: imageUrl,
      displayName,
      profile: {
        upsert: {
          create: profile,
          update: profile,
        },
      },
    };

    await axios.patch('/api/me', prismaUpdateQuery);
    setSnackbarMessage('Saved');
    setIsSaving(false);
    setIsOpen(false);
  };

  const handleBioChange = useCallback((newValue: string) => {
    setProfile(prof => {
      return { ...prof, bio: newValue };
    });
  }, []);

  const openFileBrowser = () => {
    if (!imageUploadRef?.current) return;

    imageUploadRef.current.openFileBrowser();
  };

  const sessionEmailIsUserEmail =
    (session?.user?.email == user?.email && user?.email) || (session?.user?.email == user?.email2 && user?.email2);

  return (
    <>
      <Dialog maxWidth='xs' open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', margin: '0px' } }} onClose={handleClose}>
        <DialogContent className=''>
          <Typography mb={3} variant='h2'>
            {simplifiedMode ? 'Edit Profile' : 'Settings'}
          </Typography>
          {!simplifiedMode && (
            <>
              <Box sx={{ mb: 2 }}>
                <Checkbox checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)}></Checkbox> Hide my name from public view
              </Box>
              <Divider sx={{ mb: 2 }}></Divider>
            </>
          )}
          {(!session || !sessionEmailIsUserEmail) && (
            <>
              <Typography mb={2} variant='body1'>
                {simplifiedMode ? 'To share your latest profile picture' : `To share your LinkedIn, Instagram, or Twitter contact info`}{' '}
                with other attendees, login with your email address to update your profile:
              </Typography>
              <Button
                color='secondary'
                variant='contained'
                fullWidth
                onClick={() => {
                  if (session) signOut({ redirect: false });
                  signIn();
                }}
              >
                Login to Edit {simplifiedMode ? 'Profile Picture' : 'Contact Info'}
              </Button>
            </>
          )}
          {sessionEmailIsUserEmail && (
            <>
              <Typography mb={3} variant='h6'>
                {simplifiedMode ? 'Profile Information' : 'Contact Information/Display Name'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  textAlign: 'left',
                  alignItems: 'center',
                  justifyContent: 'start',
                  gap: '30px',
                  mb: 5,
                }}
              >
                <Box
                  sx={{
                    borderRadius: '100%',
                    height: '85px',
                    width: '85px',
                    overflow: 'hidden',

                    boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
                  }}
                >
                  <ImageUploadAndPreview
                    imageUrl={imageUrl}
                    setImageUrl={newImageUrl => {
                      setImageUrl(newImageUrl);
                    }}
                    maxHeight={250}
                    maxWidth={250}
                    size='small'
                    hideEditButton={true}
                    ref={imageUploadRef}
                  ></ImageUploadAndPreview>
                </Box>
                <Button variant='outlined' onClick={openFileBrowser}>
                  Update Photo
                </Button>
              </Box>
              <TextField
                value={displayName}
                onChange={e => {
                  setDisplayName(e.target.value);
                }}
                fullWidth
                label='Name'
                size='small'
                sx={{ marginBottom: 3 }}
                id='name-field'
              ></TextField>

              {!simplifiedMode && (
                <>
                  <AttendeeContactForm profile={profile} setProfile={setProfile}></AttendeeContactForm>
                  <Box sx={{ marginBottom: 3, display: 'block' }}>
                    <TextField
                      size='small'
                      fullWidth
                      multiline={true}
                      label='Bio'
                      value={profile.bio}
                      placeholder='Enter a short bio to display on your profile...'
                      minRows={2}
                      onChange={e => {
                        setProfile(prof => {
                          return { ...prof, bio: e.target.value };
                        });
                      }}
                    ></TextField>
                  </Box>
                </>
              )}
            </>
          )}
          {(!session || !sessionEmailIsUserEmail) && (
            <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
              Close
            </Button>
          )}
          {session && sessionEmailIsUserEmail && (
            <SplitRow>
              <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
                Close
              </Button>

              <LoadingButton variant='contained' color='primary' sx={{ mt: 3, width: '100%' }} onClick={save} isLoading={isSaving}>
                Save
              </LoadingButton>
            </SplitRow>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2500}
        onClose={() => {
          setSnackbarMessage('');
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSnackbarMessage('');
          }}
          severity='success'
          color='info'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default AttendeeSettingsDialog;
