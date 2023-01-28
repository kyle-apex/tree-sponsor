import IconButton from '@mui/material/IconButton';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { MuiColor } from 'interfaces';

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
  return (
    <IconButton title={tooltip || 'Copy to Clipboard'} size='small' onClick={() => copyToClipboard(text)}>
      <CopyIcon color={color} sx={{ fontSize: fontSize }}></CopyIcon>
    </IconButton>
  );
};
export default CopyIconButton;
