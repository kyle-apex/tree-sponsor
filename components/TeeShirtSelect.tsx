import React, { useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  full: {
    width: '100%',
  },
}));

export const TeeShirtSelect = ({
  userId,
  hasShirt,
  updateHasShirt,
}: {
  userId: number;
  hasShirt: boolean;
  updateHasShirt: (id: number, attributes: Record<string, unknown>) => any;
}) => {
  const classes = useStyles();
  const [userHasShirt, setUserHasShirt] = useState(hasShirt);

  const updateSize = async (hasShirt: boolean) => {
    updateHasShirt(userId, { hasShirt: !!hasShirt });
    setUserHasShirt(hasShirt);
  };

  return (
    <FormControl className={classes.full}>
      <Select
        displayEmpty
        value={userHasShirt ? 1 : 0}
        onChange={event => {
          updateSize(!!event.target.value);
        }}
        size='small'
      >
        <MenuItem value={0}>No</MenuItem>
        <MenuItem value={1}>Yes</MenuItem>
      </Select>
    </FormControl>
  );
};
