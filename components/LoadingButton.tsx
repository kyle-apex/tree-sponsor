import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import React from 'react';

const LoadingButton = ({
  children,
  size,
  className,
  variant = 'contained',
  color = 'primary',
  onClick,
  isLoading,
  disabled,
  sx,
}: {
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}): JSX.Element => {
  return (
    <Button
      size={size}
      sx={{ minHeight: '40px', ...sx }}
      disabled={isLoading || disabled}
      className={className}
      variant={variant}
      color={color}
      onClick={onClick}
    >
      {!isLoading ? children : <CircularProgress size={24} color={color} />}
    </Button>
  );
};
export default LoadingButton;
