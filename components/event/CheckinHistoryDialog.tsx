import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import { PartialEventCheckIn } from 'interfaces';
import { signOut, useSession, signIn } from 'next-auth/client';
import CheckinHistory from './CheckinHistory';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions } from '@mui/material';

const CheckinHistoryDialog = ({
  isOpen,
  setIsOpen,
  checkins,
  onNavigate,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void);
  checkins: PartialEventCheckIn[];
  onNavigate?: () => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const [session] = useSession();
  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: '#6E4854', marginBottom: 2 }}>
        <Typography color='white' variant='h6'>
          Event History
        </Typography>
      </DialogTitle>
      <DialogContent className='' sx={{ pb: 1 }}>
        {session && (
          <CheckinHistory
            checkins={checkins}
            handleClose={() => {
              handleClose();
              if (onNavigate) onNavigate();
            }}
          />
        )}
        {!session && (
          <>
            <Typography mb={2} variant='body1'>
              To view your check-in history, login with your email address:
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
              Login to View History
            </Button>
          </>
        )}
        <Divider sx={{ marginBottom: 1 }}></Divider>
      </DialogContent>
      <DialogActions>
        <Button fullWidth color='inherit' onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CheckinHistoryDialog;
