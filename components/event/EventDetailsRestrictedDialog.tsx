import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';

interface EventDetailsRestrictedDialogProps {
  open: boolean;
  onClose: () => void;
  onRSVP: () => void;
  onSignIn: () => void;
}

const EventDetailsRestrictedDialog: React.FC<EventDetailsRestrictedDialogProps> = ({ open, onClose, onRSVP, onSignIn }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ backgroundColor: theme => theme.palette.primary.main, marginBottom: 2 }}>
        <Typography color='white' variant='h6'>
          Event Details Restricted
        </Typography>
      </DialogTitle>
      <DialogContent>
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
            Only RSVP&apos;d guests can view full event details
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsRestrictedDialog;
