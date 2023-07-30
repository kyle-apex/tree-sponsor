import React, { useEffect, useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FieldSize } from 'interfaces';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useQueryClient } from 'react-query';
import { useDebouncedCallback } from 'use-debounce';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import LoadingButton from 'components/LoadingButton';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';

const Selector = <T extends { id?: number }>({
  defaultValue,
  onChange,
  onSelect,
  size = 'small',
  getOptionLabel,
  queryKey = 'selectorOptions',
  apiPath,
  optionDisplay,
  hasMatchingValue,
  label,
  sx,
  isLoading,
  resetOnSelect,
  hasAdd,
}: {
  defaultValue?: number;
  onChange?: (val: number) => void;
  onSelect?: (item: T) => void;
  size?: FieldSize;
  getOptionLabel: (option: T) => string;
  queryKey?: string;
  apiPath: string;
  optionDisplay: (option: T) => React.ReactNode;
  hasMatchingValue: (currentValue: T, searchText: string) => boolean;
  label?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
  resetOnSelect?: boolean;
  hasAdd?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = React.useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState<any | string>(null); // should be T | string, but typescript couldn't quite figure that oout
  const autoCompleteRef = useRef<HTMLElement>();
  //const { add } = useAddToQuery<T>(queryKey, addToDatabase);

  async function addToDatabase(item: Partial<T>): Promise<T> {
    const newItem = { ...item };
    const result = await axios.post(`/api/${apiPath}/`, newItem);
    refetch();
    const resultItem = result.data as T;
    if (onSelect) onSelect(resultItem);
    if (onChange) onChange(resultItem?.id);
    setSearchText('');
    return resultItem;
  }

  const debouncedSetSearchText = useDebouncedCallback((value: string) => {
    setSearchText(value);
  }, 200);

  async function fetchOptions(searchText = '', currentValue?: T | string, context?: any) {
    if (
      typeof currentValue !== 'string' &&
      hasMatchingValue(currentValue, searchText)
      //(currentValue?.displayName === searchText || (!currentValue?.displayName && currentValue?.name === searchText))
    )
      return [currentValue];

    if (!searchText && context?.queryKey?.length > 1 && context.queryKey[1].includes('id'))
      return await fetchDefaultValue(Number(context.queryKey[1].split(':')[1]));
    const { data } = await axios.get(`/api/${apiPath}/options?search=` + encodeURIComponent(searchText));

    return data;
  }

  const fetchDefaultValue = async (id: number) => {
    const { data } = await axios.get(`/api/${apiPath}/` + id);
    return [data];
  };

  const { data, isFetching, refetch } = useQuery<T[]>(
    [queryKey, searchText || !defaultValue ? searchText : 'id:' + defaultValue],
    context => fetchOptions(searchText, value, context),
    {
      keepPreviousData: true,
      initialData: [],
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const prefetchData = async () => {
    if (!defaultValue) queryClient.prefetchQuery([queryKey, ''], () => fetchOptions(''));
    else {
      let data = queryClient.getQueryData([queryKey, 'id:' + defaultValue]) as T[];
      if (!data || data.length === 0) {
        await queryClient.prefetchQuery([queryKey, 'id:' + defaultValue], () => fetchDefaultValue(defaultValue));

        data = queryClient.getQueryData([queryKey, 'id:' + defaultValue]) as T[];
        if (data && data.length === 1) setValue(data[0]);
      } else {
        const existingSpecies = data.find(species => species.id == defaultValue);
        if (!existingSpecies) {
          await queryClient.prefetchQuery([queryKey, 'id:' + defaultValue], () => fetchDefaultValue(defaultValue));
          data = queryClient.getQueryData([queryKey, 'id:' + defaultValue]) as T[];
        }
        const newValue = data.find(species => species.id == defaultValue);
        setValue(newValue || null);
      }
    }
  };

  useEffect(() => {
    if (typeof value === 'string' || defaultValue != value?.id) prefetchData();
  }, [defaultValue]);

  useEffect(() => {
    if (!defaultValue) prefetchData();
  }, []);

  return (
    <Box flexDirection='row' gap={1} sx={{ display: 'flex', ...sx }}>
      <Autocomplete
        sx={{ flex: '1 1 100%' }}
        ref={autoCompleteRef}
        options={data}
        loading={isFetching}
        value={value}
        isOptionEqualToValue={(option: T, value: T) => option?.id === value?.id}
        onInputChange={(_event, value) => {
          debouncedSetSearchText(value);
        }}
        onChange={(_event, option: T | string) => {
          if (option && typeof option != 'string') {
            if (onChange) onChange(option.id);
            if (onSelect) onSelect(option);
          }
          setValue(option);
          if (resetOnSelect) {
            setTimeout(() => {
              setValue(null);
            });

            autoCompleteRef.current.parentElement.parentElement.focus();
          }
        }}
        autoHighlight={true}
        getOptionLabel={getOptionLabel}
        filterOptions={a => a}
        renderOption={(props, option: T) => (
          <Box
            component='li'
            sx={{ display: 'flex', width: '100%', overflow: 'hidden', flexDirection: 'column', alignItems: 'flex-start !important' }}
            {...props}
          >
            {optionDisplay(option)}
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            size={size}
            InputProps={{
              ...params.InputProps,
              autoComplete: 'off',
              endAdornment: (
                <React.Fragment>
                  {isFetching || isLoading ? <CircularProgress color='primary' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            autoComplete='off'
          />
        )}
      ></Autocomplete>
      {hasAdd && (
        <LoadingButton
          isLoading={isAdding}
          color='primary'
          variant='contained'
          disabled={!searchText}
          sx={{ flex: '1 0 100px' }}
          onClick={() => {
            addToDatabase({ name: searchText } as any);
          }}
        >
          Add New
        </LoadingButton>
      )}
    </Box>
  );
};

export default Selector;
