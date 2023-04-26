import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IdentifyTreeFlow from './IdentifyTreeFlow';

const IdentifyTreeFlowDialog = ({ open, setOpen }: { open: boolean; setOpen: (isOpen: boolean) => void }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: 2 } }} onClose={handleClose}>
      <DialogContent>
        <IdentifyTreeFlow />
      </DialogContent>
    </Dialog>
  );
};

export default IdentifyTreeFlowDialog;
