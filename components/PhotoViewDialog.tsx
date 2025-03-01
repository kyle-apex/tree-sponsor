import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const PhotoViewDialog = ({ open, setOpen, imageUrl }: { open: boolean; setOpen: (isOpen: boolean) => void; imageUrl: string }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const url = imageUrl?.endsWith('/small') ? imageUrl.replace('/small', '/full') : imageUrl;

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', minWidth: '200px', margin: 2 } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0, position: 'relative' }} className={classes.content} onDoubleClick={handleClose}>
        <IconButton onClick={handleClose} className='hoverImageIconButton' sx={{ position: 'absolute', right: 15, top: 15, zIndex: 5000 }}>
          <ClearIcon></ClearIcon>
        </IconButton>
        {isLoading && (
          <Box sx={{ padding: '50px', backgroundColor: 'lightgray' }}>
            <CircularProgress size={100} />
          </Box>
        )}
        <TransformWrapper centerZoomedOut={true}>
          <TransformComponent>
            <img
              alt='Full size image'
              style={{ maxWidth: '95vw', maxHeight: '95vh', marginBottom: '-7px', display: isLoading ? 'none' : 'inherit' }}
              src={url}
              onLoad={() => setIsLoading(false)}
            />
          </TransformComponent>
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewDialog;
