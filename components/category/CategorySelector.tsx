import React from 'react';
import Typography from '@mui/material/Typography';
import { FieldSize, PartialCategory } from 'interfaces';
import Selector from 'components/Selector';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import Box from '@mui/material/Box';

const CategorySelector = ({
  defaultValue,
  onChange,
  onSelect,
  size = 'small',
  label = 'Category',
  sx,
  isLoading,
  hasAdd,
}: {
  defaultValue?: number;
  onChange?: (val: number) => void;
  onSelect?: (item: PartialCategory) => void;
  size?: FieldSize;
  label?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
  hasAdd?: boolean;
}) => {
  return (
    <Selector<PartialCategory>
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      onSelect={onSelect}
      size={size}
      apiPath='categories'
      resetOnSelect={true}
      queryKey='categoryOptions'
      getOptionLabel={(option: PartialCategory) => `${option.name}`}
      hasMatchingValue={(currentValue: PartialCategory, searchText: string) =>
        currentValue?.name === searchText || (!currentValue?.name && currentValue?.name === searchText)
      }
      optionDisplay={option => {
        return (
          <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', paddingRight: 1, paddingLeft: 1, ...sx }} gap={2}>
            <Box>
              <Typography variant='body1'>{option.name}</Typography>
            </Box>
          </Box>
        );
      }}
      sx={sx}
      isLoading={isLoading}
      hasAdd={hasAdd}
    ></Selector>
  );
};
export default CategorySelector;
