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
          <RadioGroup onChange={e => handleChange('identificationConfidence', Number(e.target.value))}>
            <Radio value={1}></Radio> Not sure
            <Radio value={2}></Radio> Fairly confident
            <Radio value={3}></Radio> Very confident
          </RadioGroup>
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
