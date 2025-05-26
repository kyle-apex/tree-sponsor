import { Box, Button, ButtonProps } from '@mui/material';
import { FC } from 'react';

interface FundraisingButtonSelectorProps {
  amounts: number[];
  amount: number;
  setAmount: (amount: number) => void;
}

const FundraisingButtonSelector: FC<FundraisingButtonSelectorProps> = ({ amounts, amount, setAmount }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'center', mt: 2 }}>
      {amounts.map(value => {
        const isSelected = value === amount;
        const buttonProps: ButtonProps = {
          variant: isSelected ? 'contained' : 'outlined',
          color: 'primary',
          onClick: () => setAmount(value),
        };

        return (
          <Button key={value} {...buttonProps} sx={{ flex: 1, minWidth: 0, px: 1 }}>
            ${value.toLocaleString()}
          </Button>
        );
      })}
    </Box>
  );
};

export default FundraisingButtonSelector;
