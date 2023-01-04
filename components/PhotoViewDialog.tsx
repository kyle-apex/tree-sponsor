import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const PhotoViewDialog = ({ open, setOpen, imageUrl }: { open: boolean; setOpen: (isOpen: boolean) => void; imageUrl: string }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const url = imageUrl?.endsWith('/small') ? imageUrl.replace('/small', '/full') : imageUrl;

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', margin: 2 } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        <IconButton onClick={handleClose}>
          <ClearIcon></ClearIcon>
        </IconButton>
        <img style={{ maxWidth: '100%' }} src={url} />
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewDialog;
