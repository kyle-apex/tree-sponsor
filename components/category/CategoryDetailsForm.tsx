// TODO
import { PartialCategory } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import CategoryMultiSelect from 'components/category/CategoryMultiSelect';
import DateTimeField from 'components/form/DateTimeField';
import Skeleton from '@mui/material/Skeleton';
import SplitRow from 'components/layout/SplitRow';
import UniquePathField from 'components/form/UniquePathField';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';

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

const CategoryDetailsForm = ({
  category,
  updateAttribute,
}: {
  category: PartialCategory;
  updateAttribute: (name: keyof PartialCategory, value: unknown) => void;
}) => {
  const [hasActiveDates, setHasActiveDates] = useState(false);

  return (
    <>
      <TextField
        value={category?.name}
        onChange={e => updateAttribute('name', e.target.value)}
        label='Name'
        size='small'
        sx={{ marginBottom: 3 }}
        id='name-field'
      ></TextField>

      <Box sx={{ marginTop: 3, marginBottom: 3, minHeight: '110px', display: 'block' }}>
        <TextEditor
          label='Description'
          placeholder='Enter a description of your category'
          value={category?.description}
          onChange={val => updateAttribute('description', val)}
        />
      </Box>
      <UniquePathField
        label='Category Link Path'
        initialValue={category.path}
        validatorPath='/categories/is-duplicate-path?path='
        onChange={newValue => {
          updateAttribute('path', newValue);
        }}
      ></UniquePathField>
    </>
  );
};
export default CategoryDetailsForm;
