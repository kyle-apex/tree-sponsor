import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import LoadingButton from 'components/LoadingButton';
import React, { useState, useMemo } from 'react';

const AddComment = ({ onAdd, isAdding }: { onAdd: (text: string) => void; isAdding?: boolean }) => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');

  const addComment = () => {
    onAdd(text);
  };

  const cancelComment = () => {
    setIsActive(false);
  };

  return (
    <Box flexDirection='column'>
      <TextField
        onFocus={() => setIsActive(true)}
        placeholder='Add a comment...'
        value={isActive ? text : ''}
        onChange={e => setText(e.target.value)}
        size='small'
        sx={{ marginBottom: 1, width: '100%' }}
        minRows={isActive ? 2 : 1}
        multiline
      ></TextField>
      {isActive && (
        <Box sx={{ marginBottom: 2 }}>
          <LoadingButton size='small' onClick={addComment} color='secondary' variant='contained' isLoading={isAdding}>
            Submit
          </LoadingButton>
          <Button size='small' onClick={cancelComment} color='inherit' sx={{ marginLeft: 1 }}>
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default AddComment;
