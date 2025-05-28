import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import { PartialUser } from 'interfaces';
import { UserAvatar } from 'components/sponsor';
import GuestListItem from './GuestListItem';

interface GuestListDialogProps {
  open: boolean;
  onClose: () => void;
  hasRSVP: boolean;
  users?: PartialUser[];
  goingCount?: number;
  maybeCount?: number;
  showHostsOnly?: boolean;
  onRSVP?: () => void;
  onSignIn?: () => void;
  currentUser?: PartialUser;
}

const GuestListDialog: React.FC<GuestListDialogProps> = ({
  open,
  onClose,
  hasRSVP,
  users = [],
  goingCount = 0,
  maybeCount = 0,
  showHostsOnly = false,
  onRSVP,
  onSignIn,
  currentUser,
}) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ borderRadius: '8px' }} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          background: theme => `radial-gradient(circle at -50% -50%, #1b2b1c 0%, ${theme.palette.primary.main} 70%)`,
          marginBottom: 2,
          padding: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IconButton
          aria-label='close'
          onClick={onClose}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              {showHostsOnly ? 'Event Hosts' : 'Guest List'}
            </Typography>
          </Box>
          {!showHostsOnly && (
            <Typography variant='h6' sx={{ pl: 0, opacity: 0.9 }}>
              {goingCount} Going {maybeCount > 0 ? `• ${maybeCount} Maybe` : ''}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowY: 'auto',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '90px',
            background: theme => `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${theme.palette.background.paper} 100%)`,
            pointerEvents: 'none', // Allows clicking through the gradient
          },
        }}
      >
        {hasRSVP ? (
          <Box>
            {users.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {showHostsOnly ? (
                  <Box>
                    {users.map((user, index) => (
                      <Box
                        key={user.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <UserAvatar image={user.image} name={user.displayName || user.name} size={30} colorIndex={index % 6} />
                        <Typography variant='subtitle2'>{user.displayName || user.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <>
                    {/* Going users section */}
                    {goingCount > 0 && (
                      <Box>
                        <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 600, mb: 1 }}>
                          Going ({goingCount})
                        </Typography>
                        {users
                          .filter((_user, index) => index < goingCount)
                          .map((user, index) => {
                            return <GuestListItem key={user.id} user={user} index={index} currentUser={currentUser} />;
                          })}
                      </Box>
                    )}

                    {/* Maybe users section */}
                    {maybeCount > 0 && (
                      <Box>
                        <Typography variant='subtitle1' color='primary' sx={{ fontWeight: 600, mb: 1 }}>
                          Maybe ({maybeCount})
                        </Typography>
                        {users
                          .filter((_user, index) => index >= goingCount && index < goingCount + maybeCount)
                          .map((user, index) => {
                            return <GuestListItem key={user.id} user={user} index={index} currentUser={currentUser} />;
                          })}
                      </Box>
                    )}
                  </>
                )}
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
