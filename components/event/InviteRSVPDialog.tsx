import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import { PartialEvent, PartialEventCheckIn, PartialEventRSVP, PartialUser } from 'interfaces';
import { signOut, useSession, signIn } from 'next-auth/client';
import CheckinHistory from './CheckinHistory';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import RSVPStatusToggleButton from './RSVPStatusToggleButton';

const InviteRSVPDialog = ({
  isOpen,
  setIsOpen,
  event,
  invitedByUser,
  initialName,
  initialEmail,
  onRSVP,
  isSignIn = false,
  initialStatus,
  onRSVPSubmit,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
  event: PartialEvent;
  invitedByUser?: PartialUser;
  initialName?: string;
  initialEmail?: string;
  onRSVP?: () => void;
  isSignIn?: boolean;
  initialStatus?: string;
  onRSVPSubmit?: (rsvpData: PartialEventRSVP) => void;
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailOptIn, setIsEmailOptIn] = useState(false);
  const [detailsEmailOptIn, setDetailsEmailOptIn] = useState(true);
  const [status, setStatus] = useState(initialStatus || 'Going');
  const [comment, setComment] = useState('');
  const [notifyInviter, setNotifyInviter] = useState(true);

  const rsvp = async () => {
    setIsLoading(true);
    const rsvpData = {
      email,
      name,
      detailsEmailOptIn,
      emailOptIn: isEmailOptIn,
      invitedByUserId: invitedByUser?.id,
      status,
      comment: status === 'Declined' ? comment : undefined,
      notifyInviter: notifyInviter,
    };

    try {
      // Directly call the API instead of using useAddToQuery
      const submittedRSVP = (await axios.post(`/api/events/${event.id}/rsvps`, rsvpData))?.data as PartialEventRSVP;
      if (onRSVP) onRSVP();
      if (onRSVPSubmit) onRSVPSubmit(submittedRSVP);

      // Close the dialog
      setIsLoading(false);
      handleClose();

      // After a brief delay to allow the page to render, scroll to the Going/Maybe/View Guest List section
      setTimeout(() => {
        // Find the box with the distinctive styling that contains the Going/Maybe counts and View Guest List link
        const targetElement = document.querySelector('.rsvp-button-section');
        if (targetElement) {
          // Scroll to the element with smooth behavior and 40px padding at the top
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 40,
            behavior: 'smooth',
          });
        }
      }, 300); // 300ms delay to allow for dialog closing animation and page update
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setIsLoading(false);
      handleClose();
    }
  };

  const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newStatus: string | null) => {
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const [session] = useSession();
  const theme = useTheme();
  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle
        sx={{
          background: theme => `radial-gradient(circle at -50% -50%, #1b2b1c 0%, ${theme.palette.primary.main} 70%)`,
          marginBottom: 2,
          pl: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              {isSignIn ? 'Sign In' : 'RSVP'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent className='' sx={{ pb: 1 }}>
        {!isSignIn && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup value={status} exclusive onChange={handleStatusChange} aria-label='RSVP status' sx={{ width: '100%' }}>
              <RSVPStatusToggleButton value='Going' selected={status === 'Going'} emoji='🎉' label='Going' />
              <RSVPStatusToggleButton value='Maybe' selected={status === 'Maybe'} emoji='🤷' label='Maybe' />
              <RSVPStatusToggleButton value='Declined' selected={status === 'Declined'} emoji='😔' label='Decline' />
            </ToggleButtonGroup>
          </Box>
        )}
        {!isSignIn && (
          <TextField
            fullWidth
            label='Name'
            value={name}
            onChange={e => setName(e.target.value)}
            size='small'
            sx={{ mb: 3, mt: 1 }}
            required={status !== 'Declined'}
            autoComplete='name'
          ></TextField>
        )}
        <TextField
          fullWidth
          label='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          size='small'
          sx={{ mb: 1, mt: isSignIn ? 1 : 0 }}
          required={status !== 'Declined'}
          autoComplete='email'
        ></TextField>
        {(status === 'Going' || status === 'Maybe') && !isSignIn && (
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              mb: 2,
              ml: 1,
              color: 'var(--secondary-text-color)',
              fontStyle: 'italic',
              mt: -1,
            }}
          >
            Just for updates for this event. No spam.
          </Typography>
        )}
        {status === 'Declined' && !isSignIn && (
          <>
            {invitedByUser && (
              <FormGroup sx={{ marginBottom: 2 }}>
                <FormControlLabel
                  sx={{
                    '.MuiSvgIcon-root': { color: 'rgba(0, 0, 0, 0.4)' },
                    '& .MuiFormControlLabel-label': {
                      fontSize: '.75rem',
                      color: 'var(--secondary-text-color)',
                      fontStyle: 'italic',
                    },
                    marginRight: '0px',
                  }}
                  control={
                    <Checkbox
                      checked={notifyInviter}
                      onChange={e => {
                        setNotifyInviter(e.target.checked);
                      }}
                      color='default'
                      size='small'
                    />
                  }
                  label={`Let ${invitedByUser?.name?.split(' ')[0]} know I can't make it`}
                />
              </FormGroup>
            )}
            {notifyInviter && invitedByUser && (
              <TextField
                fullWidth
                label='Message (optional)'
                value={comment}
                onChange={e => setComment(e.target.value)}
                size='small'
                multiline
                rows={3}
                sx={{ mb: 2 }}
              ></TextField>
            )}
          </>
        )}
        {!isSignIn && status !== 'Declined' && (
          <>
            <FormGroup sx={{ marginBottom: 2 }}>
              <FormControlLabel
                sx={{
                  '.MuiSvgIcon-root': { color: 'rgba(0, 0, 0, 0.4)' },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '.75rem',
                    color: 'var(--secondary-text-color)',
                    fontStyle: 'italic',
                  },
                  marginRight: '0px',
                }}
                control={
                  <Checkbox
                    checked={isEmailOptIn}
                    onChange={e => {
                      setIsEmailOptIn(e.target.checked);
                    }}
                    color='default'
                    size='small'
                  />
                }
                label={`Learn about future events via the TreeFolksYP newsletter`}
              />
            </FormGroup>
          </>
        )}
        <Divider sx={{ marginBottom: 1 }}></Divider>
      </DialogContent>
      <DialogActions>
        <SplitRow>
          <Button fullWidth color='inherit' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            disabled={(!name && !isSignIn && status !== 'Declined') || (!email && status !== 'Declined')}
            sx={{
              width: '100%',
              minWidth: '140px',
              '& .MuiButton-startIcon': {
                position: 'absolute',
                left: '8px',
              },
            }}
            isLoading={isLoading}
            variant='contained'
            color='primary'
            onClick={rsvp}
          >
            {isSignIn ? 'Sign In' : `${status === 'Going' ? 'Submit RSVP' : status === 'Maybe' ? 'Submit Maybe' : 'Decline Invite'}`}
          </LoadingButton>
        </SplitRow>
      </DialogActions>
    </Dialog>
  );
};
export default InviteRSVPDialog;
