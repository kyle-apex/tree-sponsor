import { useState, useEffect } from 'react';
import parsedGet from 'utils/api/parsed-get';
const UniquePathField = ({ initialValue, isFetched }: { initialValue: string; isFetched: boolean }) => {
  const [state, setState] = useState({
    value: '',
    isLoading: false,
    isDuplicate: false,
    initialValue: '',
    hasPatternError: false,
  });
  useEffect(() => {
    if (!isFetched) return;

    if (initialValue)
      setState(state => {
        return { ...state, value: initialValue, initialValue };
      });
  }, [initialValue, isFetched]);

  const handleChange = async (event: { target: { value: string } }) => {
    //setIsChanged(true);
    const value = event.target.value;
    const hasPatternError = !/^[a-z-]+$/.test(value);
    setState(state => {
      return { ...state, value, hasPatternError };
    });
    if (value != state.initialValue && !hasPatternError) {
      const isDuplicate = false; // (await parsedGet(`/api/users/${user.id}/is-duplicate-profile-path?profilePath=${profilePath}`)) as boolean;
      setState(state => {
        return { ...state, isDuplicate };
      });
    }
  };

  return <></>;
};
export default UniquePathField;
