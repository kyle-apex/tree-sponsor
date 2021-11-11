import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { FormInputProps } from './interfaces';
//<FormTextField name='profilePath' label='Profile Path' rules={{ pattern: '[a-z]', required: true }} control={control}></FormTextField>
export const FormTextField = ({ name, control, label, rules }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <TextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          size='small'
        />
      )}
    />
  );
};
