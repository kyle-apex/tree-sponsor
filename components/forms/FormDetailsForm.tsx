import { PartialForm } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import Skeleton from '@mui/material/Skeleton';
import React, { useState } from 'react';
import { paramCase } from 'change-case';
import JsonField from 'components/form/JsonField';

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

      <Box sx={{ marginTop: 3, marginBottom: 2, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Description'
          placeholder='Enter a description to appear below the title of the form'
          value={form?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <JsonField label='Questions JSON' value={form?.questionsJson} onChange={val => updateAttribute('questionsJson', val)}></JsonField>
    </>
  );
};
export default FormDetailsForm;
