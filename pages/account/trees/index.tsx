import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Layout from 'components/layout/Layout';
import SplitRow from 'components/layout/SplitRow';
import AddTreeDialog from 'components/tree/AddTreeDialog';
import React, { useState } from 'react';

const AccountTreePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Layout title='Account'>
      <SplitRow alignItems='center'>
        <Typography color='secondary' variant='h1'>
          Tree IDs
        </Typography>
        <Button
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Add Tree
        </Button>
      </SplitRow>

      <AddTreeDialog setIsOpen={setIsDialogOpen} isOpen={isDialogOpen}></AddTreeDialog>
    </Layout>
  );
};

export default AccountTreePage;
