import { Button, makeStyles, TextField, Box } from '@material-ui/core';
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { flexbox } from '@material-ui/system';

const useStyles = makeStyles(theme => ({
  container: {
    gap: theme.spacing(2),
    width: '100%',
  },
  addButton: {
    whiteSpace: 'nowrap',
    width: '250px',
  },
}));

export default function AddByName({
  label,
  buttonText,
  action,
}: {
  label: string;
  buttonText: string;
  action: (newName: string) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const classes = useStyles();

  async function add() {
    setIsLoading(true);
    await action(newName);
    setIsLoading(false);
    setNewName('');
  }
  return (
    <Box display='flex' className={classes.container}>
      <TextField label={label} value={newName} onChange={event => setNewName(event.target.value)} fullWidth></TextField>
      <Button
        className={classes.addButton}
        disabled={!newName || isLoading}
        onClick={add}
        color='primary'
        variant='contained'
        startIcon={<AddIcon />}
      >
        {buttonText}
      </Button>
    </Box>
  );
}
