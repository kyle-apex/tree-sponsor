import React from 'react';
import Typography from '@mui/material/Typography';
import { FieldSize, PartialUser } from 'interfaces';
import Selector from 'components/Selector';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import { UserAvatar } from './sponsor';
import Box from '@mui/material/Box';

const UserSelector = ({
  defaultValue,
  onChange,
  onSelect,
  size = 'small',
  label = 'User',
  sx,
  autoWidth,
  isLoading,
  isEmailHidden,
  resetOnSelect = true,
}: {
  defaultValue?: number;
  onChange?: (val: number) => void;
  onSelect?: (item: PartialUser) => void;
  size?: FieldSize;
  label?: string;
  sx?: SxProps<Theme>;
  autoWidth?: boolean;
  isLoading?: boolean;
  isEmailHidden?: boolean;
  resetOnSelect?: boolean;
}) => {
  return (
    <Selector<PartialUser>
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      onSelect={onSelect}
      size={size}
      apiPath='users'
      resetOnSelect={resetOnSelect}
      queryKey='userOptions'
      getOptionLabel={(option: PartialUser) =>
        `${option.displayName || option.name || option.email}${
          (option.displayName || option.name) && option.email ? ' (' + option.email + ')' : ''
        }`
      }
      hasMatchingValue={(currentValue: PartialUser, searchText: string) =>
        currentValue?.displayName === searchText || (!currentValue?.displayName && currentValue?.name === searchText)
      }
      optionDisplay={option => {
        return (
          <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', paddingRight: 1, paddingLeft: 1, ...sx }} gap={2}>
            <UserAvatar name={option?.displayName || option?.name} image={option?.image} size={36} />
            <Box>
              <Typography variant='body1'>{option.displayName || option.name || option.email}</Typography>
              {!isEmailHidden && (
                <Typography variant='subtitle2' sx={{ fontStyle: 'italic' }} color='gray'>
                  {option.email}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      sx={sx}
      autoWidth={autoWidth}
      isLoading={isLoading}
    ></Selector>
  );
};
export default UserSelector;
