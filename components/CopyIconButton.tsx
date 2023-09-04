import IconButton from '@mui/material/IconButton';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { MuiColor } from 'interfaces';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const copyToClipboard = (text: string) => {
  navigator?.clipboard?.writeText(text);
};

const CopyIconButton = ({
  text,
  tooltip,
  fontSize = 'inherit',
  color = 'inherit',
}: {
  text: string;
  tooltip?: string;
  fontSize?: string;
  color?: MuiColor;
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <>
      <IconButton
        title={tooltip || 'Copy to Clipboard'}
        size='small'
        onClick={() => {
          copyToClipboard(text);
          setSnackbarOpen(true);
        }}
      >
        <CopyIcon color={color} sx={{ fontSize: fontSize }}></CopyIcon>
      </IconButton>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity='success' color='info' sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};
export default CopyIconButton;
