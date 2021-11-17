import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { PartialSponsorship } from 'interfaces';
import SponsorshipAddEditForm from './SponsorshipAddEditForm';

const SponsorshipAddEditDialog = ({
  sponsorship,
  isOpen,
  setIsOpen,
  setSponsorship,
}: {
  sponsorship?: PartialSponsorship;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSponsorship?: React.Dispatch<React.SetStateAction<PartialSponsorship>>;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className=''>
        <Typography mb={3} variant='h2'>
          Tell us about your tree
        </Typography>
        <SponsorshipAddEditForm
          sponsorship={sponsorship}
          setSponsorship={setSponsorship}
          onComplete={() => {
            setIsOpen(false);
          }}
        ></SponsorshipAddEditForm>
      </DialogContent>
    </Dialog>
  );
};
export default SponsorshipAddEditDialog;
