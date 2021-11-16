import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/system/Box';
import UserAvatar from 'components/sponsor/UserAvatar';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { PartialComment } from 'interfaces';
import React, { useState } from 'react';
import Link from 'next/link';

const formatCommentDate = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'short', day: 'numeric' });

  if (date.getFullYear() != new Date().getFullYear()) dateStr += ' ' + date.getFullYear();
  return dateStr;
};

const CommentDisplay = ({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: PartialComment;
  currentUserId?: number;
  onDelete?: (id: number) => void;
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  return (
    <Box flexDirection='row' sx={{ display: 'flex' }} gap={2} mb={2}>
      <Box pt={1}>
        <UserAvatar image={comment.user.image} name={comment.user.displayName || comment.user.name} size={30} />
      </Box>
      <Box className='full-width'>
        <Box flexDirection='row' gap={2} sx={{ display: 'flex', marginBottom: 0.5, width: '100%', alignItems: 'center' }}>
          <Link href={'/u/' + comment.user.profilePath}>
            <Typography variant='subtitle2' color='primary' className='clickable' sx={{ fontWeight: 600 }}>
              {comment.user.displayName || comment.user.name}
            </Typography>
          </Link>
          <Typography variant='subtitle2' color='gray'>
            {formatCommentDate(comment.createdDate)}
          </Typography>
          {comment.user.id == currentUserId && comment.id && onDelete && (
            <Box sx={{ textAlign: 'right', flex: '1 1 auto', color: 'gray' }}>
              <IconButton size='small'>
                <TrashIcon onClick={() => setIsDeleteConfirmationOpen(true)} color='inherit' sx={{ fontSize: '1.2rem' }}></TrashIcon>
              </IconButton>
              <DeleteConfirmationDialog
                open={isDeleteConfirmationOpen}
                setOpen={setIsDeleteConfirmationOpen}
                onConfirm={() => {
                  onDelete(comment.id);
                }}
                title='Delete Comment?'
                itemType='comment'
              ></DeleteConfirmationDialog>
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant='body2'>{comment.text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default CommentDisplay;
