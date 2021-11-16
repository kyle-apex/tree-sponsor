import { Typography } from '@mui/material';
import Box from '@mui/system/Box';
import UserAvatar from 'components/sponsor/UserAvatar';
import { PartialComment } from 'interfaces';
import React from 'react';
import Link from 'next/link';

const formatCommentDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'short', day: 'numeric' });

  if (date.getFullYear() != new Date().getFullYear()) dateStr += ' ' + date.getFullYear();
  return dateStr;
};

const CommentDisplay = ({ comment }: { comment: PartialComment }) => {
  return (
    <Box flexDirection='row' sx={{ display: 'flex' }} gap={2} mb={2}>
      <Box pt={0.5}>
        <UserAvatar image={comment.user.image} name={comment.user.displayName || comment.user.name} size={30} />
      </Box>

      <Box>
        <Box flexDirection='row' gap={2} sx={{ display: 'flex', marginBottom: 0.5 }}>
          <Link href={'/u/' + comment.user.profilePath}>
            <Typography variant='subtitle2' color='primary' className='clickable' sx={{ fontWeight: 600 }}>
              {comment.user.displayName || comment.user.name}
            </Typography>
          </Link>

          <Typography variant='subtitle2' color='gray'>
            {formatCommentDate(comment.createdDate)}
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2'>{comment.text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default CommentDisplay;
