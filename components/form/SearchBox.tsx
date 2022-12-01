import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({
  label,
  onChange,
  size = 'small',
  defaultValue,
  mb
}: {
  label: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
  defaultValue?: string;
  mb?: number
}) => {
  return (
    <TextField
      className={'full-width'}
      id='search-box'
      label={label}
      size={size}
      sx={{ background: 'white', mb }}
      defaultValue={defaultValue}
      onChange={event => {
        onChange(event.target.value);
      }}
      autoComplete='off'
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBox;
