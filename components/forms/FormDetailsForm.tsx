import { PartialForm } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';
import React, { useState } from 'react';
import { paramCase } from 'change-case';
import JsonField from 'components/form/JsonField';
import UniquePathField from 'components/form/UniquePathField';

const TextEditor = dynamic(() => import('components/TextEditor'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <>
      <Skeleton variant='text' sx={{ width: '15%' }} />
      <Skeleton variant='rectangular' sx={{ width: '100%', marginBottom: 3 }} height={100} />
    </>
  ),
});

const FormDetailsForm = ({
  form,
  updateAttribute,
}: {
  form: PartialForm;
  updateAttribute: (name: keyof PartialForm | string, value: unknown) => void;
}) => {
  const [name, setName] = useState(form.name);
  const [path, setPath] = useState(form?.path);
  return (
    <>
      <TextField
        value={name}
        onChange={e => {
          const newName = e.target.value;
          updateAttribute('name', newName);
          setName(newName);
        }}
        label='Name'
        size='small'
        sx={{ marginBottom: 3 }}
        id='name-field'
      ></TextField>
      <Box sx={{ mb: 0 }}>
        <UniquePathField
          label='Form Link Path'
          initialValue={path}
          validatorPath={'/forms/is-duplicate-path?id=' + (form?.id || 0) + '&path='}
          onChange={newValue => {
            updateAttribute('path', newValue);
            setPath(newValue);
          }}
          disabled={!name}
          dependendentValue={name}
          linkPreviewPrefix='Form will be available at: tfyp.org/f/'
        ></UniquePathField>
      </Box>
      <Box sx={{ marginBottom: 2, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Description'
          placeholder='Enter a description to appear below the title of the form'
          value={form?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <JsonField label='Questions JSON' value={form?.questionsJson} onChange={val => updateAttribute('questionsJson', val)}></JsonField>
      <Box sx={{ marginTop: 4, marginBottom: 2, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Message to Show After Submit'
          placeholder='Thank you for your response.'
          value={form?.completedMessage}
          onChange={val => updateAttribute('completedMessage', val)}
        />
      </Box>
    </>
  );
};
export default FormDetailsForm;
