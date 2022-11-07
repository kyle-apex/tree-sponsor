import IconButton from '@mui/material/IconButton';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/system/Box';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import React, { useState } from 'react';

const DeleteIconButton = ({ title, itemType = 'item', onDelete }: { title?: string; itemType?: string; onDelete?: () => void }) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  return (
    <Box sx={{ color: 'gray' }}>
      <IconButton size='small' onClick={() => setIsDeleteConfirmationOpen(true)}>
        <TrashIcon color='inherit' sx={{ fontSize: '1.2rem' }}></TrashIcon>
      </IconButton>
      <DeleteConfirmationDialog
        open={isDeleteConfirmationOpen}
        setOpen={setIsDeleteConfirmationOpen}
        onConfirm={onDelete}
        title={title}
        itemType={itemType}
      ></DeleteConfirmationDialog>
    </Box>
  );
};
export default DeleteIconButton;
