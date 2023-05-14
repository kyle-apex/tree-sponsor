import React from 'react';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import { PartialTree } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

const AddTreeFormFields = ({
  tree,
  handleChange,
}: {
  tree: PartialTree;
  handleChange: (propertyName: string, value: string | number) => void;
}) => {
  return (
    <Card sx={{ boxShadow: 'none', '.MuiCardContent-root': { paddingRight: 0, paddingLeft: 0 } }}>
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
        className='box-shadow'
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
        <SpeciesSelector size='medium' onChange={speciesId => handleChange('speciesId', speciesId)}></SpeciesSelector>
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
          sx={{ mb: 3, mt: 2 }}
          label='Name/Nickname (ex: The Treaty Oak)'
          onChange={e => handleChange('name', e.target.value)}
        ></TextField>
        <Accordion
          sx={{
            mb: 2,
            mt: 0,
            '&:before': { opacity: 0.2 },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
            <Typography color='secondary' variant='inherit' sx={{ fontSize: '1.2rem' }}>
              Advanced Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              sx={{ marginBottom: 2 }}
              label='Height Estimation (feet)'
              onChange={e => handleChange('height', e.target.value)}
              type='number'
              fullWidth
            ></TextField>
            <TextField
              sx={{ marginBottom: 2 }}
              label='Diameter (inches)'
              onChange={e => handleChange('diameter', e.target.value)}
              type='number'
              fullWidth
            ></TextField>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AddTreeFormFields;
