import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
  updateHasShirt: (id: number, attributes: Record<string, unknown>) => void;
}): JSX.Element => {
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
