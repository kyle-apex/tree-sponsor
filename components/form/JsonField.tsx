import { TextField } from '@mui/material';
import { parse } from 'path';
import { useState } from 'react';

const parseJSON = (str: string): any => {
  try {
    let obj;
    eval('obj=' + str);
    return obj;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  return;
};

const JsonField = ({
  value,
  onChange,
  label,
  indentSpaces = 4,
}: {
  value: any;
  onChange: (val: any) => void;
  label?: string;
  indentSpaces?: number;
}) => {
  const [formattedValue, setFormattedValue] = useState(value ? JSON.stringify(value, null, indentSpaces) : '');
  return (
    <TextField
      value={formattedValue}
      label={label}
      onChange={e => {
        setFormattedValue(e.target.value);
      }}
      onBlur={e => {
        if (!e.target.value) onChange(null);
        else {
          const json = parseJSON(e.target.value);

          if (json) {
            setFormattedValue(JSON.stringify(json, null, indentSpaces));
            onChange(json);
          }
        }
      }}
      multiline={true}
      minRows={5}
      maxRows={20}
      sx={{
        '.MuiInputBase-inputMultiline': {
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          overflowX: 'scroll',
        },
      }}
    ></TextField>
  );
};
export default JsonField;
