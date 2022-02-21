import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({
  label,
  onChange,
  size = 'small',
  defaultValue,
}: {
  label: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
  defaultValue?: string;
}) => {
  return (
    <TextField
      className={'full-width'}
      id='search-box'
      label={label}
      size={size}
      sx={{ background: 'white' }}
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
