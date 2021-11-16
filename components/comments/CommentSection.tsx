import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/system/Box';
import React from 'react';
import AddComment from './AddComment';
import CommentDisplay from './CommentDisplay';

const CommentSection = ({
  comments,
  onAdd,
  isLoading,
  isAdding,
}: {
  comments: any[];
  onAdd?: (text: string) => void;
  isLoading?: boolean;
  isAdding?: boolean;
}) => {
  return (
    <Box sx={{ padding: 2 }}>
      {isLoading ? (
        <>
          <Skeleton variant='text' sx={{ width: '100%' }} />
          <Skeleton variant='text' sx={{ width: '75%' }} />
        </>
      ) : (
        <>
          {onAdd && <AddComment isAdding={isAdding} onAdd={onAdd}></AddComment>}
          {comments?.map((comment, idx) => (
            <>
              {idx > 0 && <hr />}
              <CommentDisplay key={comment.id || comment.text} comment={comment}></CommentDisplay>
            </>
          ))}
        </>
      )}
    </Box>
  );
};
export default CommentSection;
