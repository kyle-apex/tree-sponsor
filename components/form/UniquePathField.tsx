import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import parsedGet from 'utils/api/parsed-get';
import ErrorText from './ErrorText';
const UniquePathField = ({
  initialValue,
  isFetched,
  validatorPath,
  label,
  onChange,
  disabled,
}: {
  initialValue: string;
  isFetched?: boolean;
  validatorPath: string;
  label: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [state, setState] = useState({
    value: '',
    isLoading: false,
    isDuplicate: false,
    initialValue: '',
    hasPatternError: false,
  });
  useEffect(() => {
    if (isFetched === false) return;

    if (initialValue)
      setState(state => {
        return { ...state, value: initialValue, initialValue };
      });
  }, [initialValue, isFetched]);

  const handleChange = async (event: { target: { value: string } }) => {
    //setIsChanged(true);
    const value = event.target.value;
    const hasPatternError = !/^[a-z0-9-]+$/.test(value);
    setState(state => {
      return { ...state, value, hasPatternError };
    });
    if (value != state.initialValue && !hasPatternError) {
      const isDuplicate = (await parsedGet(`/api${validatorPath}${state.value}`)) as boolean;
      if (!isDuplicate) onChange(value);
      setState(state => {
        return { ...state, isDuplicate };
      });
    }
  };

  return (
    <Box mb={3}>
      <TextField
        value={state.value}
        onChange={handleChange}
        label={label || 'path'}
        size='small'
        inputProps={{ pattern: '[a-z0-9-]' }}
        error={state.isDuplicate || state.hasPatternError}
        spellCheck='false'
        id='profile-path-field'
        fullWidth={true}
        disabled={disabled}
      ></TextField>
      {state.hasPatternError && <ErrorText>{label} must only contain lower case letters, numbers, and &quot;-&quot;</ErrorText>}
      {state.isDuplicate && <ErrorText>{label} is already in use</ErrorText>}
    </Box>
  );
};
export default UniquePathField;
