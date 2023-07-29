import React from 'react';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import TextField from '@mui/material/TextField';
import { PartialTree, PartialCategory } from 'interfaces';
import SpeciesSelector from './SpeciesSelector';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryMultiSelect from 'components/category/CategoryMultiSelect';

const TreeFormFields = ({
  tree,
  handleChange,
}: {
  tree: PartialTree;
  handleChange: (propertyName: string, value: string | number | PartialCategory[]) => void;
}) => {
  // updating usequery via handleChange does not trigger re-render to show lower section
  //console.log('tree form field render');
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
            onChange={e => {
              handleChange('identificationConfidence', Number(e.target.value));
              tree.identificationConfidence = Number(e.target.value);
            }}
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

      <Accordion
        sx={{
          mb: 2,
          mt: 0,
          '&:before': { opacity: 0.2 },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography color='secondary' variant='inherit'>
            Advanced Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
          <CategoryMultiSelect
            label='Add a Category'
            selectedCategories={tree?.categories}
            onUpdated={categories => {
              handleChange('categories', categories);
            }}
          ></CategoryMultiSelect>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default TreeFormFields;
