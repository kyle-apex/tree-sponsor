import { Dialog, DialogContent, Typography } from '@mui/material';
import { PartialSponsorship } from 'interfaces';
import SponsorshipAddEditForm from './SponsorshipAddEditForm';

const SponsorshipAddEditDialog = ({
  sponsorship,
  isOpen,
  setIsOpen,
}: {
  sponsorship?: PartialSponsorship;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className='section-background'>
        <Typography mb={3} variant='h2'>
          Tell us about your tree
        </Typography>
        <SponsorshipAddEditForm
          sponsorship={sponsorship}
          onComplete={() => {
            setIsOpen(false);
          }}
        ></SponsorshipAddEditForm>
      </DialogContent>
    </Dialog>
  );
};
export default SponsorshipAddEditDialog;
