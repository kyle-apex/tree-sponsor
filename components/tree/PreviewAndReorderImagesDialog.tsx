import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PreviewAndReorderImages from 'components/PreviewAndReorderImages';
import { PartialTreeImage } from 'interfaces';
import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';

const PreviewAndReorderImagesDialog = ({
  images,
  isOpen,
  setIsOpen,
  onAdd,
  onDelete,
}: {
  images: PartialTreeImage[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd?: (imageUrl: string) => void;
  onDelete?: (uuid: string) => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle sx={{ paddingBottom: 0 }}>
        <SplitRow>
          Edit Images
          <IconButton onClick={handleClose}>
            <ClearIcon></ClearIcon>
          </IconButton>
        </SplitRow>
      </DialogTitle>
      <DialogContent className=''>
        <Typography mb={3} variant='h2'></Typography>
        <PreviewAndReorderImages images={images} onAdd={onAdd} onDelete={onDelete} />
      </DialogContent>
    </Dialog>
  );
};
export default PreviewAndReorderImagesDialog;
