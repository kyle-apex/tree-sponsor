import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/system/Box';
import LoadingButton from 'components/LoadingButton';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import useTheme from '@mui/system/useTheme';

const AddComment = ({ onAdd, isAdding }: { onAdd: (text: string) => void; isAdding?: boolean }) => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLInputElement>();

  const theme = useTheme();

  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const addComment = () => {
    onAdd(text);
  };

  const cancelComment = () => {
    setIsActive(false);
  };

  const onFocus = () => {
    setIsActive(true);
    setTimeout(() => {
      if (isMobile && scrollRef.current && scrollRef.current.scrollIntoView) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1);
  };

  useEffect(() => {
    if (!isAdding) {
      setText('');
      setIsActive(false);
    }
  }, [isAdding]);

  return (
    <Box flexDirection='column'>
      <TextField
        ref={scrollRef}
        onFocus={() => onFocus()}
        placeholder='Add a comment...'
        value={isActive ? text : ''}
        onChange={e => setText(e.target.value)}
        size='small'
        sx={{ marginBottom: isActive ? 1 : 1, width: '100%' }}
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
