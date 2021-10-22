import { Button, CircularProgress } from '@mui/material';
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
}: {
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  disabled?: boolean;
}): JSX.Element => {
  return (
    <Button
      size={size}
      sx={{ height: '40px' }}
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
