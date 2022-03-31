import Button from '@mui/material/Button';
import AddTreeDialog from 'components/tree/AddTreeDialog';
import React, { useState } from 'react';

const AccountTreePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        Add Tree
      </Button>
      <AddTreeDialog setIsOpen={setIsDialogOpen} isOpen={isDialogOpen}></AddTreeDialog>
    </>
  );
};

export default AccountTreePage;
