import Typography from '@mui/material/Typography';
import React, { ReactNode } from 'react';

const ErrorText = ({ children }: { children: ReactNode }) => {
  return (
    <Typography color='error' variant='caption' mt={-3} mb={2}>
      {children}
    </Typography>
  );
};
export default ErrorText;
