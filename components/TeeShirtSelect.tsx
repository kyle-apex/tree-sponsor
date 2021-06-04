import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  full: {
    width: '100%',
  },
}));

export const TeeShirtSelect = ({ userId, size }: { userId: string; size: string }) => {
  const classes = useStyles();
  const [shirtSize, setShirtSize] = useState(size);

  const updateSize = async (newSize: string) => {
    setShirtSize(newSize);
    try {
      const result = await axios.post('/api/users/' + userId, { shirtSize: newSize });
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
        value={shirtSize}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          updateSize(event.target.value as string);
        }}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        <MenuItem value='XS'>XS</MenuItem>
        <MenuItem value='S'>S</MenuItem>
        <MenuItem value='M'>M</MenuItem>
        <MenuItem value='L'>L</MenuItem>
        <MenuItem value='XL'>XL</MenuItem>
        <MenuItem value='XXL'>XXL</MenuItem>
      </Select>
    </FormControl>
  );
};
