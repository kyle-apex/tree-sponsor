import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

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
