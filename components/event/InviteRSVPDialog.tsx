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
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import axios from 'axios';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
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
}) => {
  const { add } = useAddToQuery<any>(`events/${event.id}/rsvps`, addToDatabase);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailOptIn, setIsEmailOptIn] = useState(false);
  const [detailsEmailOptIn, setDetailsEmailOptIn] = useState(true);
  const [status, setStatus] = useState(initialStatus || 'Going');
  const [comment, setComment] = useState('');
  const [notifyInviter, setNotifyInviter] = useState(true);

  async function addToDatabase(rsvp: any) {
    const result = await axios.post(`/api/events/${event.id}/rsvps`, rsvp);
    return result.data;
  }

  const rsvp = async () => {
    setIsLoading(true);
    await add({
      email,
      name,
      detailsEmailOptIn,
      emailOptIn: isEmailOptIn,
      invitedByUserId: invitedByUser?.id,
      status,
      comment: status === 'Declined' ? comment : undefined,
      notifyInviter: status === 'Declined' ? notifyInviter : undefined,
    });

    setIsLoading(false);
    if (onRSVP) onRSVP();
    handleClose();
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
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const [session] = useSession();
  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: theme => theme.palette.primary.main, marginBottom: 2 }}>
        <Typography color='white' variant='h6'>
          {isSignIn ? 'Sign In' : 'RSVP'}
        </Typography>
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
            sx={{ mb: 2, mt: 1 }}
            required={status !== 'Declined'}
          ></TextField>
        )}
        <TextField
          fullWidth
          label='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          size='small'
          sx={{ mb: 2, mt: isSignIn ? 1 : 0 }}
          required={status !== 'Declined'}
        ></TextField>
        {status === 'Declined' && !isSignIn && (
          <>
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
                  label={`Let ${invitedByUser.name} know that I won't be able to make it`}
                />
              </FormGroup>
            )}
          </>
        )}
        {!isSignIn && status !== 'Declined' && (
          <>
            <FormGroup sx={{ marginBottom: 1 }}>
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
                    checked={detailsEmailOptIn}
                    onChange={e => {
                      setDetailsEmailOptIn(e.target.checked);
                    }}
                    color='default'
                    size='small'
                  />
                }
                label={`Send me any email updates related to this event`}
              />
            </FormGroup>
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
            sx={{ width: '100%' }}
            isLoading={isLoading}
            variant='contained'
            color='primary'
            onClick={rsvp}
          >
            {isSignIn ? 'Sign In' : `${status === 'Going' ? 'Submit RSVP' : status === 'Maybe' ? ' Submit Maybe' : 'Decline Invite'}`}
          </LoadingButton>
        </SplitRow>
      </DialogActions>
    </Dialog>
  );
};
export default InviteRSVPDialog;
