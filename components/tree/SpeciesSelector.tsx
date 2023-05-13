import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { FieldSize, PartialSpecies } from 'interfaces';
import Selector from 'components/Selector';

const SpeciesSelector = ({
  defaultValue,
  onChange,
  size = 'small',
}: {
  defaultValue?: number;
  onChange: (val: number) => void;
  size?: FieldSize;
}) => {
  return (
    <Selector<PartialSpecies>
      label='Species'
      defaultValue={defaultValue}
      onChange={onChange}
      size={size}
      apiPath='species'
      queryKey='speciesOptions'
      getOptionLabel={(option: PartialSpecies) => `${option.commonName}`}
      hasMatchingValue={(currentValue: PartialSpecies, searchText: string) => currentValue?.commonName === searchText}
      optionDisplay={option => {
        return (
          <>
            <Typography variant='body1'>{option.commonName}</Typography>
            <Typography variant='subtitle2' sx={{ fontStyle: 'italic' }} color='gray'>
              {option.name}
            </Typography>
          </>
        );
      }}
    ></Selector>
  );
};

export default SpeciesSelector;
