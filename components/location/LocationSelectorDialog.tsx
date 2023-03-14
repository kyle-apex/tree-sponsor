import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LocationSelector from 'components/LocationSelector';
import SplitRow from 'components/layout/SplitRow';

const DeleteConfirmationDialog = ({
  open,
  setOpen,
  onCancel,
  onSave,
  title,
  latitude,
  longitude,
}: {
  onCancel?: () => void;
  onSave?: (location: { longitude: number; latitude: number }) => void;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  title?: string;
  latitude: number;
  longitude: number;
}) => {
  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

  const cancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };
  const save = () => {
    if (onSave) onSave(location);
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent sx={{ maxWidth: '600px', width: '95vw' }}>
        <LocationSelector
          onViewportChange={({ latitude, longitude }) => {
            setLocation({ latitude, longitude });
          }}
          latitude={latitude}
          longitude={longitude}
          zoomToLocation={!latitude}
          mapStyle='SATELLITE'
          zoom={19}
        ></LocationSelector>
      </DialogContent>
      <DialogActions>
        <SplitRow>
          <Button onClick={cancel}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </SplitRow>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
