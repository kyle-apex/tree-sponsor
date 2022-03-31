import React from 'react';
import MUIRichTextEditor from 'mui-rte';
import NotchedOutlineLabel from './layout/NotchedOutlineLabel';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

/* IMPORTANT!!!

To use this component in a SSR page, you have to import it like so:

import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
  loading: () => <p>Loading</p>
});

*/

const TextEditor = ({
  placeholder,
  label,
  value,
  onChange,
}: {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
}) => {
  const contentHTML = convertFromHTML(value || '');
  const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
  const content = JSON.stringify(convertToRaw(state));

  return (
    <NotchedOutlineLabel label={label}>
      <MUIRichTextEditor
        label={placeholder || 'Start typing...'}
        controls={['bold', 'italic', 'underline', 'link', 'bulletList', 'undo', 'redo']}
        defaultValue={content}
        onChange={(state: EditorState) => {
          const html = stateToHTML(state.getCurrentContent());
          onChange && onChange(html);
        }}
      />
    </NotchedOutlineLabel>
  );
};
export default React.memo(TextEditor);
