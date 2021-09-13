import { Box } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { flexbox } from '@material-ui/system';

const SplitRow = ({ children }: { children: any }) => {
  const counter = 0;
  return (
    <Box flexDirection='row' display='flex'>
      <Box flex='auto' display='flex' justifyContent='start'>
        {children[0]}
      </Box>
      <Box flex='auto' display='flex' justifyContent='end'>
        {children[1]}
      </Box>
    </Box>
  );
};
export default SplitRow;
