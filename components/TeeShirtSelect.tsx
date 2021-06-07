import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  full: {
    width: '100%',
  },
}));

export const TeeShirtSelect = ({ userId, hasShirt }: { userId: string; hasShirt: boolean }) => {
  const classes = useStyles();
  const [userHasShirt, setUserHasShirt] = useState(hasShirt);

  const updateSize = async (hasShirt: boolean) => {
    setUserHasShirt(hasShirt);
    try {
      const result = await axios.post('/api/users/' + userId, { hasShirt: !!hasShirt });
    } catch (error) {
      //return alert(error.message);
    } finally {
      //
    }
  };

  return (
    <FormControl className={classes.full}>
      <Select
        displayEmpty
        value={userHasShirt ? 1 : 0}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          updateSize(event.target.value as boolean);
        }}
      >
        <MenuItem value={0}>No</MenuItem>
        <MenuItem value={1}>Yes</MenuItem>
      </Select>
    </FormControl>
  );
};
