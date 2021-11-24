import Box from '@mui/material/Box';
import React, { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import { PartialReaction } from 'interfaces';
import ReactionsDialog from './ReactionsDialog';

const ReactionCount = ({ reactions, hasDialog }: { reactions: PartialReaction[]; hasDialog?: boolean }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (hasDialog) setOpen(true);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        flexDirection='row'
        gap={0.5}
        sx={{ display: 'flex', fontSize: '.8rem', alignItems: 'center', cursor: hasDialog ? 'pointer' : '' }}
      >
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
        <Typography>{reactions?.length || 0}</Typography>
      </Box>
      {hasDialog && <ReactionsDialog reactions={reactions} open={open} setOpen={setOpen}></ReactionsDialog>}
    </>
  );
};
export default ReactionCount;
