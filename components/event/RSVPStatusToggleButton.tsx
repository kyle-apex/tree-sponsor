import { FC } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface RSVPStatusToggleButtonProps {
  value: string;
  selected: boolean;
  emoji: string;
  label: string;
  // Allow for any additional props that might be passed from ToggleButtonGroup
  [key: string]: any;
}

const RSVPStatusToggleButton: FC<RSVPStatusToggleButtonProps> = ({ value, selected, emoji, label, ...otherProps }) => {
  return (
    <ToggleButton
      value={value}
      aria-label={label}
      // Forward all other props to ensure event handlers are passed through
      {...otherProps}
      sx={{
        flexDirection: 'column',
        height: '70px', // Fixed height regardless of selection state
        width: '33%',
        position: 'relative',
        fontSize: '1.6rem', // Keep font size change as a selection indicator
        ...(selected && {
          // Add visual selection indicators while keeping size consistent
          backgroundColor: theme => `${theme.palette.primary.main}10`, // Light tint of primary color
          borderColor: theme => theme.palette.primary.main,
          borderWidth: '1px',
        }),
        '& .MuiTypography-root': {
          fontSize: '0.8rem',
        },
      }}
    >
      {selected && (
        <CheckCircleIcon
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            fontSize: '1rem',
            color: 'primary.main',
          }}
        />
      )}
      {emoji}
      <Typography sx={{ marginTop: '0pm !important' }} mb={1}>
        {label}
      </Typography>
    </ToggleButton>
  );
};

export default RSVPStatusToggleButton;
