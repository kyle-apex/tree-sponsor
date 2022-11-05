import React from 'react';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import { PartialTree } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';

const AddTreeFormFields = ({
  tree,
  handleChange,
}: {
  tree: PartialTree;
  handleChange: (propertyName: string, value: string | number) => void;
}) => {
  return (
    <Card>
      <CardMedia
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f1f1f1',
          cursor: 'pointer',
          minHeight: '200px',
        }}
        component='div'
        title='Click to Update Image'
      >
        <ImageUploadAndPreview
          imageUrl={tree.pictureUrl}
          setImageUrl={(imageUrl: string) => {
            handleChange('pictureUrl', imageUrl);
          }}
        />
      </CardMedia>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ marginBottom: 2 }} variant='h6' color='secondary'>
          Optional Details
        </Typography>
        <SpeciesSelector onChange={speciesId => handleChange('speciesId', speciesId)}></SpeciesSelector>
        {tree.speciesId && (
          <FormControl component='fieldset' sx={{ marginTop: 2 }}>
            <FormLabel component='legend' sx={{ fontSize: '.75rem' }}>
              Identification Correctness Confidence
            </FormLabel>
            <RadioGroup onChange={e => handleChange('identificationConfidence', Number(e.target.value))}>
              <FormControlLabel value={1} control={<Radio size='small' />} label='Not sure'></FormControlLabel>
              <FormControlLabel value={2} control={<Radio size='small' />} label='Fairly confident'></FormControlLabel>
              <FormControlLabel value={3} control={<Radio size='small' />} label='Very confident'></FormControlLabel>
            </RadioGroup>
          </FormControl>
        )}
        <TextField
          sx={{ marginBottom: 3, marginTop: 2 }}
          label='Name/Nickname (ex: The Treaty Oak)'
          onChange={e => handleChange('name', e.target.value)}
        ></TextField>
        <Typography sx={{ marginBottom: 2 }} color='secondary' variant='h6'>
          Advanced Details
        </Typography>
        <TextField
          sx={{ marginBottom: 2 }}
          label='Height Estimation (feet)'
          onChange={e => handleChange('height', e.target.value)}
          type='number'
        ></TextField>
        <TextField
          sx={{ marginBottom: 2 }}
          label='Diameter (inches)'
          onChange={e => handleChange('diameter', e.target.value)}
          type='number'
        ></TextField>
      </CardContent>
    </Card>
  );
};

export default AddTreeFormFields;
