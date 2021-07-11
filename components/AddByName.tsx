import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';

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

  async function add() {
    console.log('adding');
    setIsLoading(true);
    await action('newName');
    setIsLoading(false);
    setNewName('');
  }
  return (
    <>
      <TextField label={label} value={newName} onChange={event => setNewName(event.target.value)}></TextField>
      <Button disabled={!newName || isLoading} onClick={add}>
        {buttonText}
      </Button>
    </>
  );
}
