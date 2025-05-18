import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Button, Box, Typography } from '@mui/material';

const ExpandableText = ({ children, maxHeight = 250 }: { children?: ReactNode; maxHeight?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    // Check if the content exceeds the max height
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > maxHeight);
    }
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        ref={textRef}
        variant='body1'
        sx={{
          maxHeight: isExpanded ? 'none' : maxHeight,
          overflow: 'hidden',
          position: 'relative',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? 'none' : 12, // Adjust lines as needed
        }}
      >
        {children}
      </Typography>
      {!isExpanded && isOverflowing && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '36px',
            left: 0,
            right: 0,
            width: '100%',
            height: '70px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), white)',
          }}
        />
      )}
      {isOverflowing && <Button onClick={toggleExpand}>{isExpanded ? 'Show Less' : 'Show More'}</Button>}
    </Box>
  );
};

export default ExpandableText;
