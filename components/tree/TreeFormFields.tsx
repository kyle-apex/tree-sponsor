import React from 'react';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import { PartialTree } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

const TreeFormFields = ({
  tree,
  handleChange,
}: {
  tree: PartialTree;
  handleChange: (propertyName: string, value: string | number) => void;
}) => {
  // updating usequery via handleChange does not trigger re-render to show lower section
  console.log('tree form field render');
  return (
    <>
      <Typography sx={{ marginBottom: 2 }} variant='inherit' color='secondary'>
        Optional Details
      </Typography>
      <SpeciesSelector onChange={speciesId => handleChange('speciesId', speciesId)} defaultValue={tree.speciesId}></SpeciesSelector>
      {tree.speciesId && (
        <FormControl component='fieldset' sx={{ marginTop: 2 }}>
          <FormLabel component='legend' sx={{ fontSize: '.75rem' }}>
            Identification Correctness Confidence
          </FormLabel>
          <RadioGroup
            value={tree.identificationConfidence}
            onChange={e => handleChange('identificationConfidence', Number(e.target.value))}
          >
            <FormControlLabel value={1} control={<Radio size='small' />} label='Not sure' />
            <FormControlLabel value={2} control={<Radio size='small' />} label='Fairly confident' />
            <FormControlLabel value={3} control={<Radio size='small' />} label='Very confident' />
          </RadioGroup>
        </FormControl>
      )}
      <TextField
        sx={{ marginBottom: 3, marginTop: 2 }}
        label='Name/Nickname (ex: The Treaty Oak)'
        onChange={e => handleChange('name', e.target.value)}
        defaultValue={tree.name || ''}
        value={undefined}
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
        defaultValue={tree.height}
        type='number'
        size='small'
        fullWidth={true}
      ></TextField>
      <TextField
        sx={{ marginBottom: 2 }}
        label='Diameter (inches)'
        onChange={e => handleChange('diameter', e.target.value)}
        type='number'
        defaultValue={tree.diameter}
        size='small'
        fullWidth={true}
      ></TextField>
    </>
  );
};

export default TreeFormFields;
