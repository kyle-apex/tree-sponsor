import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import { PartialLocation } from 'interfaces';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface LocationMapDialogProps {
  open: boolean;
  onClose: () => void;
  location: PartialLocation;
}

const LocationMapDialog: React.FC<LocationMapDialogProps> = ({ open, onClose, location }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to open maps app on mobile
  const openInMapsApp = () => {
    if (!location?.latitude || !location?.longitude) return;

    const address = encodeURIComponent(location.address || '');
    const mapUrl = isMobile
      ? `https://maps.google.com/maps?q=${address}&ll=${location.latitude},${location.longitude}&z=16`
      : `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

    window.open(mapUrl, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ borderRadius: '8px' }} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          background: theme => `radial-gradient(circle at -50% -50%, #1b2b1c 0%, ${theme.palette.primary.main} 70%)`,
          marginBottom: 2,
          padding: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              Location
            </Typography>
          </Box>
          <Typography variant='h6' sx={{ pl: 0, opacity: 0.9 }}>
            {location?.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          {location?.latitude && location?.longitude ? (
            <MapMarkerDisplay
              markers={[{ latitude: Number(location.latitude), longitude: Number(location.longitude) }]}
              height='300px'
              staticZoom={15}
              defaultLatitude={Number(location.latitude)}
              defaultLongitude={Number(location.longitude)}
              mapStyle='STREET'
              markerScale={1}
              showLocation={false}
            />
          ) : (
            <Typography>Map location not available</Typography>
          )}
        </Box>

        {location?.address && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
            }}
            onClick={openInMapsApp}
          >
            <PlaceIcon color='primary' />
            <Typography variant='body1'>{location.address}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationMapDialog;
