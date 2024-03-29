import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/system/Box';
import UserAvatar from 'components/sponsor/UserAvatar';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { PartialComment } from 'interfaces';
import React, { useState } from 'react';
import Link from 'next/link';
import linkifyStr from 'linkify-string';
import parse from 'html-react-parser';
import formatDateString from 'utils/formatDateString';

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
  const linkifiedComment = linkifyStr(comment.text, {
    defaultProtocol: 'https',
    target: 'blank',
    truncate: 42,
    format: {
      url: (value: string) => (value.length > 50 ? value.slice(0, 50) + '…' : value),
    },
  });

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
            {formatDateString(comment.createdDate, true)}
          </Typography>
          {comment.user.id == currentUserId && comment.id && onDelete && (
            <Box sx={{ textAlign: 'right', flex: '1 1 auto', color: 'gray' }}>
              <IconButton size='small' onClick={() => setIsDeleteConfirmationOpen(true)}>
                <TrashIcon color='inherit' sx={{ fontSize: '1.2rem' }}></TrashIcon>
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
          <Typography variant='body2'>{parse(linkifiedComment)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default CommentDisplay;
