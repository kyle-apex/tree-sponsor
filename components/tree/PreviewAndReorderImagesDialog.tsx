import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PreviewAndReorderImages from 'components/PreviewAndReorderImages';
import { PartialTreeImage } from 'interfaces';
import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import LoadingButton from 'components/LoadingButton';

const PreviewAndReorderImagesDialog = ({
  images,
  isOpen,
  setIsOpen,
  onAdd,
  onDelete,
  onMakePrimaryImage,
  onMakeLeaf,
}: {
  images: PartialTreeImage[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd?: (imageUrl: string) => void;
  onDelete?: (uuid: string) => void;
  onMakePrimaryImage?: (index: number) => void;
  onMakeLeaf?: (index: number) => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    setIsLoading(false);
    setIsMoving(false);
    setSelectedIndex(null);
  }, [images]);
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
        {images?.length > 1 && (
          <Box mb={2} sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
            <LoadingButton
              disabled={selectedIndex === null || selectedIndex == 0}
              color='inherit'
              variant='text'
              size='small'
              isLoading={isMoving}
              onClick={() => {
                onMakePrimaryImage(selectedIndex);
                setSelectedIndex(null);
                setIsMoving(true);
              }}
              sx={{ width: '110px' }}
            >
              Make Default
            </LoadingButton>
            <span style={{ color: 'rgba(0, 0, 0, 0.26)' }}>|</span>
            <LoadingButton
              disabled={selectedIndex === null || selectedIndex == 0 || images[selectedIndex].isLeaf}
              color='inherit'
              variant='text'
              size='small'
              isLoading={isUpdating}
              onClick={() => {
                onMakeLeaf(selectedIndex);
                setSelectedIndex(null);
                //setIsUpdating(true);
              }}
              sx={{ width: '110px' }}
            >
              Make Leaf
            </LoadingButton>
            <span style={{ color: 'rgba(0, 0, 0, 0.26)' }}>|</span>
            <LoadingButton
              color='inherit'
              variant='text'
              size='small'
              onClick={() => {
                setIsDeleteConfirmationOpen(true);
              }}
              disabled={selectedIndex === null}
              isLoading={isLoading}
              sx={{ width: '66px' }}
            >
              Delete
            </LoadingButton>
            <DeleteConfirmationDialog
              open={isDeleteConfirmationOpen}
              setOpen={setIsDeleteConfirmationOpen}
              onConfirm={() => {
                setIsLoading(true);
                onDelete(images[selectedIndex].uuid);
              }}
              title='Remove Picture'
              itemType='picture'
            ></DeleteConfirmationDialog>
          </Box>
        )}

        <PreviewAndReorderImages
          images={images}
          onAdd={onAdd}
          onDelete={onDelete}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </DialogContent>
    </Dialog>
  );
};
export default PreviewAndReorderImagesDialog;
