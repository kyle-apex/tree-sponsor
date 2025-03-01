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
  startIcon,
  //isLoadingOnClick,
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
  startIcon?: React.ReactNode;
  //isLoadingOnClick?: boolean;
  sx?: SxProps<Theme>;
}): JSX.Element => {
  /*const handleClick = useCallback(
    a => {
      onClick(a);
      isLoading = true;
    },
    [onClick],
  );*/
  return (
    <Button
      size={size}
      sx={{
        minHeight: '40px',
        ...sx,
      }}
      disabled={isLoading || disabled}
      className={className}
      variant={variant}
      color={color}
      onClick={onClick}
      startIcon={!isLoading ? startIcon : null}
    >
      {children}
      {isLoading && <CircularProgress size={24} color={color} sx={{ position: 'absolute' }} />}
    </Button>
  );
};
export default LoadingButton;
