import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { PartialEventCheckIn } from 'interfaces';
import CheckinHistory from './CheckinHistory';

const CheckinHistoryDialog = ({
  isOpen,
  setIsOpen,
  checkins,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  checkins: PartialEventCheckIn[];
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '300px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className=''>
        <CheckinHistory checkins={checkins} handleClose={handleClose} />
        <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default CheckinHistoryDialog;
