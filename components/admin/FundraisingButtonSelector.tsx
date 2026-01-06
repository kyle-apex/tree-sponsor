import { Box, Button, ButtonProps, TextField, InputAdornment, IconButton } from '@mui/material';
import { FC, useState, ChangeEvent, KeyboardEvent } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface FundraisingButtonSelectorProps {
  amounts: number[];
  amount: number;
  setAmount: (amount: number) => void;
}

const FundraisingButtonSelector: FC<FundraisingButtonSelectorProps> = ({ amounts, amount, setAmount }) => {
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleCustomClick = () => {
    setIsCustomActive(true);
    setCustomValue('');
  };

  const handleCloseCustom = () => {
    setIsCustomActive(false);
  };

  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomValue(value);

    // Immediately update the amount if the value is valid
    if (value && parseInt(value) > 0) {
      setAmount(parseInt(value));
    }
  };

  const handleCustomSubmit = () => {
    // Just close the custom input field
    // The amount is already updated in handleCustomChange
    if (customValue && parseInt(customValue) > 0) {
      setIsCustomActive(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      handleCloseCustom();
    }
  };

  // Check if the current amount is not in the predefined amounts (meaning it's custom)
  const isCustomAmount = !amounts.includes(amount) && amount > 0;

  // Calculate the number of buttons to show
  const visibleAmounts = isCustomActive
    ? [] // Hide all buttons when custom is active
    : amounts;

  // Calculate the width percentage for each button
  const buttonWidth = `${100 / (amounts.length + 1)}%`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'center', mt: 2 }}>
      {/* Render all visible amount buttons */}
      {visibleAmounts.map(value => {
        const isSelected = value === amount;
        const buttonProps: ButtonProps = {
          variant: isSelected ? 'contained' : 'outlined',
          color: 'primary',
          onClick: () => setAmount(value),
        };

        return (
          <Button
            key={value}
            {...buttonProps}
            sx={{
              width: buttonWidth,
              minWidth: 0,
              px: 1,
            }}
          >
            ${value.toLocaleString()}
          </Button>
        );
      })}

      {/* Custom input or button */}
      {isCustomActive ? (
        <Box
          sx={{
            width: '100%', // Take full width when custom is active
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            autoFocus
            size='small'
            fullWidth
            placeholder='Amount'
            value={customValue}
            onChange={handleCustomChange}
            onKeyDown={handleKeyDown}
            onBlur={handleCustomSubmit}
            sx={{
              '& .MuiInputBase-root': {
                height: '36.5px', // Match the height of the buttons
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' size='small' onClick={handleCloseCustom} aria-label='close custom amount'>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ) : (
        <Button
          variant={isCustomAmount ? 'contained' : 'outlined'}
          color='primary'
          onClick={handleCustomClick}
          sx={{
            width: buttonWidth,
            minWidth: 0,
            px: 1,
          }}
        >
          {isCustomAmount ? `$${amount.toLocaleString()}` : '$__'}
        </Button>
      )}
    </Box>
  );
};

export default FundraisingButtonSelector;
