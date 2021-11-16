import { Typography } from '@mui/material';
import Box from '@mui/system/Box';
import UserAvatar from 'components/sponsor/UserAvatar';
import { PartialComment } from 'interfaces';
import React from 'react';

const formatCommentDate = (date: Date): string => {
  return date.toString();
};

const CommentDisplay = ({ comment }: { comment: PartialComment }) => {
  return (
    <Box flexDirection='row' gap={2}>
      <UserAvatar image={comment.user.image} name={comment.user.displayName || comment.user.name} size={30} />
      <Box>
        <Box flexDirection='row' gap={2}>
          <Typography variant='subtitle2'>{comment.user.displayName || comment.user.name}</Typography>
          <Typography variant='subtitle2'>|</Typography>
          <Typography variant='subtitle2'>{formatCommentDate(comment.createdDate)}</Typography>
        </Box>
        <Box>{comment.text}</Box>
      </Box>
    </Box>
  );
};
export default CommentDisplay;
