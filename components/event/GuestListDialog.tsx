import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import { PartialUser } from 'interfaces';
import UserBubbles from './UserBubbles';

interface GuestListDialogProps {
  open: boolean;
  onClose: () => void;
  hasRSVP: boolean;
  users?: PartialUser[];
  goingCount?: number;
  maybeCount?: number;
  onRSVP?: () => void;
  onSignIn?: () => void;
}

const GuestListDialog: React.FC<GuestListDialogProps> = ({
  open,
  onClose,
  hasRSVP,
  users = [],
  goingCount = 0,
  maybeCount = 0,
  onRSVP,
  onSignIn,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ backgroundColor: theme => theme.palette.primary.main, marginBottom: 2 }}>
        <Typography color='white' variant='h6' sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          Guest List{' '}
          <Typography variant='body2'>
            ({goingCount} Going {maybeCount > 0 ? `${maybeCount} Maybe` : ''})
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        {hasRSVP ? (
          <Box>
            {users.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <UserBubbles users={users} maxLength={users.length} size={32} />
                <Typography variant='body2' color='text.secondary'>
                  {users[0]?.name}
                  {users.length > 1 ? `, ${users[1]?.name}` : ''}
                  {users.length > 2 ? `, and ${users.length - 2} others` : ''}
                </Typography>
              </Box>
            ) : (
              <Typography>No guests have RSVP&apos;d yet.</Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 1,
            }}
          >
            <LockIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant='h5' align='center' gutterBottom>
              Restricted Access
            </Typography>
            <Typography variant='body1' align='center' color='text.secondary' sx={{ mb: 3 }}>
              Only RSVP&apos;d guests can view event activity & see who&apos;s going
            </Typography>
            <Button variant='contained' color='primary' onClick={onRSVP} sx={{ mb: 1 }}>
              RSVP for access
            </Button>
            <Typography variant='body2' color='text.secondary'>
              Already RSVP&apos;d?{' '}
              <Button color='primary' onClick={onSignIn}>
                Sign in
              </Button>
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuestListDialog;
