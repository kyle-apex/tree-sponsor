import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DeleteConfirmationDialog = ({
  open,
  setOpen,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
}: {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}) => {
  const cancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };
  const confirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Remove Sponsorship?</DialogTitle>
      <DialogContent>
        <p>Are you sure you wish to remove this sponsorship?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>{cancelText}</Button>
        <Button onClick={confirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
