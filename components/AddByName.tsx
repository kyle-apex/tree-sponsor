import { Button, TextField, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

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
}): JSX.Element {
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
