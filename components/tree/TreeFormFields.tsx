import React from 'react';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import { PartialTree } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const TreeFormFields = ({
  tree,
  handleChange,
}: {
  tree: PartialTree;
  handleChange: (propertyName: string, value: string | number) => void;
}) => {
  return (
    <>
      <Typography sx={{ marginBottom: 2 }} variant='inherit' color='secondary'>
        Optional Details
      </Typography>
      <SpeciesSelector onChange={speciesId => handleChange('speciesId', speciesId)}></SpeciesSelector>
      {tree.speciesId && (
        <RadioGroup onChange={e => handleChange('identificationConfidence', e.target.value)}>
          <Radio value={1}></Radio> Not sure
          <Radio value={2}></Radio> Fairly confident
          <Radio value={3}></Radio> Very confident
        </RadioGroup>
      )}
      <TextField
        sx={{ marginBottom: 3, marginTop: 2 }}
        label='Name/Nickname (ex: The Treaty Oak)'
        onChange={e => handleChange('name', e.target.value)}
        size='small'
        fullWidth={true}
      ></TextField>
      <Typography sx={{ marginBottom: 2 }} color='secondary' variant='inherit'>
        Advanced Details
      </Typography>
      <TextField
        sx={{ marginBottom: 2 }}
        label='Height Estimation (feet)'
        onChange={e => handleChange('height', e.target.value)}
        type='number'
        size='small'
        fullWidth={true}
      ></TextField>
      <TextField
        sx={{ marginBottom: 2 }}
        label='Diameter (inches)'
        onChange={e => handleChange('diameter', e.target.value)}
        type='number'
        size='small'
        fullWidth={true}
      ></TextField>
    </>
  );
};

export default TreeFormFields;