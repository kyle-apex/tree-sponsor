import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

const NotchedOutlineLabel = ({ label, children }: { label: string; children: ReactNode }) => {
  return (
    <Box sx={{ display: 'inline-flex', width: '100%', position: 'relative', borderRadius: '4px' }}>
      {label && (
        <>
          <fieldset aria-hidden='true' className='notchedOutline'>
            <legend>
              <span>{label}</span>
            </legend>
          </fieldset>

          <label
            style={{
              position: 'absolute',
              top: '-8.5px',
              fontSize: '.8em',
              padding: '0 4px',
              left: '10px',
              color: 'var(--label-color)',
            }}
          >
            {label}
          </label>
        </>
      )}
      {children}
    </Box>
  );
};
export default NotchedOutlineLabel;
