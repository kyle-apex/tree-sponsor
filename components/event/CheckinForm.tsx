import useLocalStorage from 'utils/hooks/use-local-storage';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SplitRow from 'components/layout/SplitRow';
import { Dispatch, forwardRef, SetStateAction, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from 'components/LoadingButton';
import { CheckinFields, PartialUser } from 'interfaces';

export type CheckinFormHandle = {
  reset: () => void;
};

const CheckinForm = forwardRef(
  (
    {
      onSubmit,
      activeTab,
      setActiveTab,
      isLoading,
      newUserLabel = 'New/Guest',
      existingUserLabel = 'Supporter',
      isPastEvent = false,
    }: {
      onSubmit: (fields: CheckinFields) => void;
      activeTab: number;
      setActiveTab: Dispatch<SetStateAction<number>>;
      isLoading?: boolean;
      newUserLabel?: string;
      existingUserLabel?: string;
      isPastEvent?: boolean;
    },
    ref: React.Ref<CheckinFormHandle>,
  ) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [discoveredFrom, setDiscoveredFrom] = useState('');
    const [isEmailOptIn, setIsEmailOptIn] = useState(true);

    useImperativeHandle(ref, () => ({
      reset() {
        setEmail('');
        setFirstName('');
        setLastName('');
        setDiscoveredFrom('');
        setIsEmailOptIn(true);
      },
    }));

    const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      setActiveTab(newValue);
    };

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={4}>
          <Tabs value={activeTab} onChange={handleTabChange} variant='fullWidth' aria-label='basic tabs example'>
            <Tab label={newUserLabel} className='transparent' />
            <Tab
              className='transparent'
              label={
                <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                  <div>{existingUserLabel}</div>
                </Box>
              }
            />
          </Tabs>
        </Box>
        {activeTab == 0 && (
          <SplitRow gap={1}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label='First Name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              size='small'
              sx={{ mb: 3 }}
              required
              autoComplete='given-name'
            ></TextField>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label='Last Name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              size='small'
              sx={{ mb: 3 }}
              required
              autoComplete='family-name'
            ></TextField>
          </SplitRow>
        )}

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }}
          label='Email Address'
          placeholder='me@example.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          size='small'
          fullWidth
          required
          autoComplete='email'
          sx={{ mb: 3 }}
        ></TextField>
        {activeTab == 0 && (
          <Box>
            {!isPastEvent && (
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                label="How'd you learn about this event?"
                value={discoveredFrom}
                onChange={e => setDiscoveredFrom(e.target.value)}
                size='small'
                fullWidth
                sx={{ mb: 2 }}
              ></TextField>
            )}
            <FormGroup sx={{ marginBottom: 2 }}>
              <FormControlLabel
                sx={{
                  '.MuiSvgIcon-root': { color: 'rgba(0, 0, 0, 0.4)' },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '.75rem',
                    color: 'var(--secondary-text-color)',
                    fontStyle: 'italic',
                  },
                  marginRight: '0px',
                }}
                control={
                  <Checkbox
                    checked={isEmailOptIn}
                    onChange={e => {
                      setIsEmailOptIn(e.target.checked);
                    }}
                    color='default'
                    size='small'
                  />
                }
                label={`Learn about future events via our monthly email`}
              />
            </FormGroup>{' '}
          </Box>
        )}
        <LoadingButton
          isLoading={isLoading}
          disabled={!email || (activeTab == 0 && (!firstName || !lastName))}
          color='primary'
          onClick={() => {
            onSubmit({ email, firstName, lastName, isEmailOptIn, discoveredFrom });
          }}
          sx={{
            '& .Mui-disabled': { backgroundColor: 'rgba(72, 110, 98, .6)', display: 'none' },
          }}
          className='disabled-primary-button full-width'
        >
          Check-in
        </LoadingButton>
      </>
    );
  },
);
CheckinForm.displayName = 'CheckinForm';
export default CheckinForm;
