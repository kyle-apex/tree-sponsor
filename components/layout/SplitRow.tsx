import Box from '@mui/material/Box';
import { ReactNode } from 'react';

const SplitRow = ({
  children,
  alignItems = 'inherit',
  gap,
  mobileFlexDirection = 'row',
}: {
  children: ReactNode[];
  alignItems?: string;
  gap?: number;
  mobileFlexDirection?: string;
}) => {
  return (
    <Box
      display='flex'
      alignItems={alignItems}
      gap={gap}
      className='full-width'
      sx={{ flexDirection: { xs: mobileFlexDirection, sm: mobileFlexDirection, md: 'row' } }}
    >
      <Box flex='auto' display='flex' justifyContent='start'>
        {children[0]}
      </Box>
      <Box flex='auto' display='flex' flexDirection='row' gap={1} justifyContent='flex-end'>
        {children[1]}
        {children.length > 2 && children[2]}
      </Box>
    </Box>
  );
};
export default SplitRow;
