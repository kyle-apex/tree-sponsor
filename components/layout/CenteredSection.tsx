import Box from '@mui/material/Box';
import { ReactNode } from 'react';

const CenteredSection = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      className='section-background box-shadow'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: theme => theme.palette.primary.main,
        borderRadius: '5px',
        border: 'solid 1px',
        padding: '10px 20px 30px',
      }}
    >
      {children}
    </Box>
  );
};
export default CenteredSection;
