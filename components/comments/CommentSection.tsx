import Box from '@mui/system/Box';
import React from 'react';
import AddComment from './AddComment';
import CommentDisplay from './CommentDisplay';

const CommentSection = ({ comments, onAdd }: { comments: any[]; onAdd?: (text: string) => void }) => {
  return (
    <Box sx={{ padding: 2 }}>
      {onAdd && <AddComment onAdd={onAdd}></AddComment>}
      {comments?.map(comment => (
        <CommentDisplay key={comment.id} comment={comment}></CommentDisplay>
      ))}
    </Box>
  );
};
export default CommentSection;
