import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import SessionAvatar from 'components/SessionAvatar';
import { PartialUser } from 'interfaces';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { signIn, signOut, SignOutParams, useSession } from 'next-auth/client';
import AttendeeContactForm from './AttendeeContactForm';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import { Prisma } from 'utils/prisma/init';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
type booleanFunc = (isOpen: boolean) => void;

const AttendeeSettingsDialog = ({
  isOpen,
  setIsOpen,
  isPrivate,
  user,
  onSetIsPrivate,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | booleanFunc;
  isPrivate: boolean;
  onSetIsPrivate?: () => void;
  user: PartialUser;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };
  console.log('user', user);
  if (user?.profile) {
    console.log('ATTENDEE HAS USER', user.profile);
  }
  const [profile, setProfile] = useState(user?.profile);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
  };

  return (
    <>
      <Dialog maxWidth='xs' open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', margin: '0px' } }} onClose={handleClose}>
        <DialogContent className=''>
          <Typography mb={3} variant='h2'>
            Settings
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Checkbox checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)}></Checkbox> Hide my name from public view
          </Box>
          <Divider sx={{ mb: 2 }}></Divider>
          {(!session || session.user.email != user.email) && (
            <>
              <Typography mb={2} variant='body1'>
                To share your LinkedIn, Instagram, or Twitter contact info with other attendees, login with your email address to update
                your profile:
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
                Login to Edit Contact Info
              </Button>
            </>
          )}
          {session && session.user.email == user.email && (
            <>
              <Typography mb={3} variant='h6'>
                Contact Information/Display Name
              </Typography>
              <AttendeeContactForm profile={profile} setProfile={setProfile}></AttendeeContactForm>
            </>
          )}
          {(!session || session.user.email != user.email) && (
            <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
              Close
            </Button>
          )}
          {session && session.user.email == user.email && (
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
        <Alert onClose={() => setSnackbarMessage('')} severity='success' color='info' sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default AttendeeSettingsDialog;
