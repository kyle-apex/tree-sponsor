import Box from '@mui/material/Box';
import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';

const ReactionCount = ({ count }: { count: number }) => {
  return (
    <Box flexDirection='row' gap={0.5} sx={{ display: 'flex', fontSize: '.8rem', alignItems: 'center' }}>
      <Box
        sx={{
          backgroundColor: theme => theme.palette.info.main,
          borderRadius: '50%',
          textAlign: 'center',
          height: '24px',
          width: '24px',
          paddingTop: '4px',
        }}
      >
        <ThumbUpIcon sx={{ fontSize: '12px', color: 'white' }} />
      </Box>
      <Typography>{count}</Typography>
    </Box>
  );
};
export default ReactionCount;
