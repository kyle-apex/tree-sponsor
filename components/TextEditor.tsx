import React, { useLayoutEffect, useState } from 'react';
import MUIRichTextEditor from 'mui-rte';
import Box from '@mui/material/Box';
import NotchedOutlineLabel from './layout/NotchedOutlineLabel';
/* IMPORTANT!!!

To use this component in a SSR page, you have to import it like so:

import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
});

*/

const TextEditor = ({ placeholder, label }: { placeholder?: string; label?: string }) => {
  return (
    <NotchedOutlineLabel label={label}>
      <MUIRichTextEditor
        label={placeholder || 'Start typing...'}
        controls={['bold', 'italic', 'underline', 'link', 'bulletList', 'undo', 'redo']}
      />
    </NotchedOutlineLabel>
  );
};
export default TextEditor;
