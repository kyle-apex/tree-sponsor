import IconButton from '@mui/material/IconButton';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/system/Box';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const DeleteIconButton = ({
  title,
  itemType = 'item',
  onDelete,
  tooltip,
}: {
  title?: string;
  itemType?: string;
  onDelete?: () => void;
  tooltip?: string;
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ color: 'gray' }}>
      <IconButton title={tooltip} disabled={isLoading} size='small' onClick={() => setIsDeleteConfirmationOpen(true)}>
        {isLoading ? <CircularProgress size={19} /> : <TrashIcon color='inherit' sx={{ fontSize: '1.2rem' }}></TrashIcon>}
      </IconButton>
      <DeleteConfirmationDialog
        open={isDeleteConfirmationOpen}
        setOpen={setIsDeleteConfirmationOpen}
        onConfirm={() => {
          setIsLoading(true);
          onDelete();
        }}
        title={title}
        itemType={itemType}
      ></DeleteConfirmationDialog>
    </Box>
  );
};
export default DeleteIconButton;
