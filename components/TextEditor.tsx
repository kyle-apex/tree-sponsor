import React, { useLayoutEffect, useState } from 'react';
import MUIRichTextEditor from 'mui-rte';
/* IMPORTANT!!!

To use this component in a SSR page, you have to import it like so:

import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
});

*/

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
  ],
};

const TextEditor = () => {
  return (
    <>
      <MUIRichTextEditor label='Start typing...' controls={['bold', 'italic', 'underline', 'link', 'bulletList', 'undo', 'redo']} />
    </>
  );
};
export default TextEditor;
