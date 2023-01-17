import { DialogTitle, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import { PartialEventCheckIn } from 'interfaces';
import CheckinHistory from './CheckinHistory';

const CheckinHistoryDialog = ({
  isOpen,
  setIsOpen,
  checkins,
  onNavigate,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  checkins: PartialEventCheckIn[];
  onNavigate?: () => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '300px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: '#6E4854', marginBottom: 2 }}>
        <Typography color='white' variant='h6'>
          Event History
        </Typography>
      </DialogTitle>
      <DialogContent className=''>
        <CheckinHistory
          checkins={checkins}
          handleClose={() => {
            handleClose();
            if (onNavigate) onNavigate();
          }}
        />
        <Divider sx={{ marginBottom: 1 }}></Divider>
        <Button fullWidth color='inherit' sx={{ mt: 2 }} onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default CheckinHistoryDialog;
