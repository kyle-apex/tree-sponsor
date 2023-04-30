import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IdentifyTreeFlow from './IdentifyTreeFlow';

const IdentifyTreeFlowDialog = ({
  open,
  setOpen,
  onComplete,
  longitude,
  latitude,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  onComplete?: () => void;
  longitude?: number;
  latitude?: number;
}) => {
  const handleClose = () => {
    setOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: 2 } }} onClose={handleClose}>
      <DialogContent>
        <IdentifyTreeFlow onComplete={handleClose} latitude={latitude} longitude={longitude} />
      </DialogContent>
    </Dialog>
  );
};

export default IdentifyTreeFlowDialog;
