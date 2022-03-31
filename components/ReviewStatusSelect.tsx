import React from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ReviewStatus } from 'interfaces';
import InputLabel from '@mui/material/InputLabel';

const defaultOptions: ReviewStatus[] = ['New', 'Draft', 'Modified', 'Approved', 'Rejected'];

export const ReviewStatusSelect = ({
  value = '',
  onChange,
  label,
  mb = 0,
  emptyLabel,
  options,
}: {
  value: ReviewStatus;
  onChange: (value: ReviewStatus) => void;
  label?: string;
  mb?: number;
  emptyLabel?: string;
  options?: ReviewStatus[];
}): JSX.Element => {
  if (!options) options = defaultOptions;
  return (
    <FormControl size='small' className='full-width' sx={{ marginBottom: mb }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={event => {
          onChange(event.target.value as ReviewStatus);
        }}
        size='small'
        label={label}
      >
        {emptyLabel && (
          <MenuItem key={emptyLabel} value=''>
            {emptyLabel}
          </MenuItem>
        )}
        {options.map(status => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
