import TextField, { TextFieldPropsSizeOverrides } from '@mui/material/TextField';
import { useState } from 'react';

const TextFieldIsolated = ({
  initialValue,
  label,
  size,
  className = 'full-width',
  onChange,
  multiline,
}: {
  initialValue?: string;
  label: string;
  size?: 'small' | 'medium';
  className?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <TextField
      value={value}
      onChange={e => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      label={label}
      size={size}
      multiline={multiline}
      autoComplete='off'
      className={className}
    ></TextField>
  );
};
export default TextFieldIsolated;
