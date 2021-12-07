import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PartialSpecies } from 'interfaces';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useQueryClient } from 'react-query';
import { useDebouncedCallback } from 'use-debounce';

async function fetchSpecies(searchText = '') {
  const { data } = await axios.get('/api/species/options?search=' + encodeURIComponent(searchText));
  return data;
}

const SpeciesSelector = ({ defaultValue, onChange }: { defaultValue?: number; onChange: (val: number) => void }) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = React.useState('');
  const [value, setValue] = useState<PartialSpecies | string>(null);

  const debouncedSetSearchText = useDebouncedCallback((value: string) => {
    setSearchText(value);
  }, 200);

  const fetchDefaultValue = async (id: number) => {
    const { data } = await axios.get('/api/species/' + id);
    setValue(data);
    return [data];
  };

  const { data, isFetching, refetch } = useQuery<PartialSpecies[]>(['speciesOptions', searchText], () => fetchSpecies(searchText), {
    keepPreviousData: true,
    staleTime: 60 * 1000,
    initialData: [],
  });

  const prefetchData = async () => {
    if (!defaultValue) queryClient.prefetchQuery(['speciesOptions', ''], () => fetchSpecies(''));
    else {
      queryClient.prefetchQuery(['speciesOptions', ''], () => fetchDefaultValue(defaultValue));
    }
  };

  useEffect(() => {
    prefetchData();
  }, []);

  useEffect(() => {
    refetch();
  }, [searchText]);

  return (
    <>
      <Autocomplete
        options={data}
        loading={isFetching}
        value={value}
        isOptionEqualToValue={(option: PartialSpecies, value: PartialSpecies) => option.id === value.id}
        onInputChange={(_event, value) => {
          debouncedSetSearchText(value);
        }}
        onChange={(_event, option: PartialSpecies | string) => {
          if (option && typeof option != 'string') {
            onChange(option.id);
          }
          setValue(option);
        }}
        autoHighlight={true}
        getOptionLabel={(option: PartialSpecies) => `${option.commonName}`}
        filterOptions={a => a}
        renderOption={(props, option: PartialSpecies) => (
          <Box component='li' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start !important' }} {...props}>
            <Typography variant='body1'>{option.commonName}</Typography>
            <Typography variant='subtitle2' sx={{ fontStyle: 'italic' }} color='gray'>
              {option.name}
            </Typography>
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label='Select a species'
            InputProps={{
              ...params.InputProps,
              autoComplete: 'off',
              endAdornment: (
                <React.Fragment>
                  {isFetching ? <CircularProgress color='primary' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            autoComplete='off'
          />
        )}
      ></Autocomplete>
    </>
  );
};

export default SpeciesSelector;
