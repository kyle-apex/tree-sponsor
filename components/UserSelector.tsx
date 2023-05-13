import React from 'react';
import Typography from '@mui/material/Typography';
import { FieldSize, PartialUser } from 'interfaces';
import Selector from 'components/Selector';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';

const UserSelector = ({
  defaultValue,
  onChange,
  onSelect,
  size = 'small',
  label = 'User',
  sx,
  isLoading,
}: {
  defaultValue?: number;
  onChange?: (val: number) => void;
  onSelect?: (item: PartialUser) => void;
  size?: FieldSize;
  label?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
}) => {
  return (
    <Selector<PartialUser>
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      onSelect={onSelect}
      size={size}
      apiPath='users'
      resetOnSelect={true}
      queryKey='userOptions'
      getOptionLabel={(option: PartialUser) => `${option.displayName || option.name || option.email}`}
      hasMatchingValue={(currentValue: PartialUser, searchText: string) =>
        currentValue?.displayName === searchText || (!currentValue?.displayName && currentValue?.name === searchText)
      }
      optionDisplay={option => {
        return (
          <>
            <Typography variant='body1'>{option.displayName || option.name || option.email}</Typography>
            <Typography variant='subtitle2' sx={{ fontStyle: 'italic' }} color='gray'>
              {option.email}
            </Typography>
          </>
        );
      }}
      sx={sx}
      isLoading={isLoading}
    ></Selector>
  );
};
export default UserSelector;
