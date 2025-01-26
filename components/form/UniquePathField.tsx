import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import parsedGet from 'utils/api/parsed-get';
import ErrorText from './ErrorText';

function toPath(baseString: string): string {
  if (!baseString) return '';
  const suggestedPath = baseString.replace(/ /g, '-').replace(/\./g, '-');
  return suggestedPath.toLowerCase();
}

const UniquePathField = ({
  initialValue,
  isFetched,
  validatorPath,
  label,
  onChange,
  disabled,
  dependendentValue,
  linkPreviewPrefix,
}: {
  initialValue: string;
  isFetched?: boolean;
  validatorPath: string;
  label: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  dependendentValue?: string;
  linkPreviewPrefix?: string;
}) => {
  const [state, setState] = useState({
    value: '',
    isLoading: false,
    isDuplicate: false,
    initialValue: '',
    hasPatternError: false,
  });
  const [priorDependentValue, setPriorDependentValue] = useState('');

  useEffect(() => {
    if (isFetched === false) return;

    if (initialValue)
      setState(state => {
        return { ...state, value: initialValue, initialValue };
      });
  }, [initialValue, isFetched]);

  useEffect(() => {
    if (!dependendentValue) return;
    // update the path if it hasn't been customized
    if (
      !priorDependentValue ||
      (toPath(priorDependentValue) == state.value && toPath(dependendentValue) != state.value && priorDependentValue != dependendentValue)
    ) {
      setPriorDependentValue(dependendentValue);
      setState(state => {
        return { ...state, value: toPath(dependendentValue) };
      });
      handleChange({ target: { value: toPath(dependendentValue) } });
    } else setPriorDependentValue(dependendentValue);
  }, [dependendentValue, state, priorDependentValue]);

  const handleChange = async (event: { target: { value: string } }) => {
    //setIsChanged(true);
    const value = event.target.value;
    const hasPatternError = !/^[a-z0-9-]+$/.test(value);
    setState(state => {
      return { ...state, value, hasPatternError };
    });
    if (value != state.initialValue && !hasPatternError) {
      const isDuplicate = (await parsedGet(`/api${validatorPath}${value}`)) as boolean;
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
        helperText={linkPreviewPrefix && state.value ? `${linkPreviewPrefix}${state.value}` : ''}
      ></TextField>
      {state.hasPatternError && <ErrorText>{label} must only contain lower case letters, numbers, and &quot;-&quot;</ErrorText>}
      {state.isDuplicate && <ErrorText>{label} is already in use</ErrorText>}
    </Box>
  );
};
export default UniquePathField;
