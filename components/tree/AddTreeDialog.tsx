import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { PartialTree } from 'interfaces';
import AddTreeForm from './AddTreeForm';

const AddTreeDialog = ({
  isOpen,
  setIsOpen,
  onComplete,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete?: () => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className=''>
        <Typography mb={3} variant='h2'>
          Add a tree
        </Typography>
        <AddTreeForm
          onComplete={() => {
            setIsOpen(false);
            if (onComplete) onComplete();
          }}
        ></AddTreeForm>
      </DialogContent>
    </Dialog>
  );
};
export default AddTreeDialog;
