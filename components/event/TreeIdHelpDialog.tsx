import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import SessionAvatar from 'components/SessionAvatar';
import { PartialUser } from 'interfaces';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import ImageCropper, { FileBrowserHandle } from 'components/ImageCropper';
import { useState, useRef } from 'react';
import SuggestSpecies from 'components/tree/SuggestSpecies';

const AttendeeContactDialog = ({
  isOpen,
  setIsOpen,
  treeId,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeId?: number;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const [imageUrl, setImageUrl] = useState('');
  const imageCropperRef = useRef<FileBrowserHandle>();
  const imageRef = useRef<any>();

  const [croppedImage, setCroppedImage] = useState('');

  const doCrop = async () => {
    console.log('treeId', treeId);
    const { base64Image } = imageCropperRef?.current?.doCrop();
    setCroppedImage(base64Image);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '400px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent>
        <Box sx={{ textAlign: 'center' }}>
          {!croppedImage && (
            <ImageCropper
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              ref={imageCropperRef}
              imageRef={imageRef}
              addSubtitleText='Click to add a picture of a leaf or two for identification suggestions'
              previewSx={{ borderRadius: '50%', maxWidth: '100%', width: '200px', height: '200px', margin: '20px auto' }}
            ></ImageCropper>
          )}
          {croppedImage && (
            <img
              alt='Leaf Image'
              src={croppedImage}
              style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto', flex: '1 0 200px' }}
            ></img>
          )}
        </Box>
        {!croppedImage && (
          <Button fullWidth variant='contained' color='primary' sx={{ mt: 3 }} onClick={doCrop} disabled={!imageUrl}>
            Crop
          </Button>
        )}

        {croppedImage && <SuggestSpecies maxSuggestions={3} imageContent={croppedImage}></SuggestSpecies>}
        {croppedImage && (
          <Button
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 3 }}
            onClick={() => {
              setCroppedImage(null);
            }}
          >
            Take Another Picture
          </Button>
        )}
        <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
          Back to the Quiz
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default AttendeeContactDialog;
