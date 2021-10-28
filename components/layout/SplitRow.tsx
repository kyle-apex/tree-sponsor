import Box from '@mui/material/Box';
import { ReactNode } from 'react';

const SplitRow = ({ children }: { children: ReactNode[] }) => {
  return (
    <Box flexDirection='row' display='flex'>
      <Box flex='auto' display='flex' justifyContent='start'>
        {children[0]}
      </Box>
      <Box flex='auto' display='flex' justifyContent='flex-end'>
        {children[1]}
      </Box>
    </Box>
  );
};
export default SplitRow;
