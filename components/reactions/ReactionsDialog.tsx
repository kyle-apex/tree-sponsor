import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReactionCount from './ReactionCount';
import { PartialReaction } from 'interfaces';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';
import UserDisplay from 'components/sponsor/UserDisplay';

const ReactionsDialog = ({
  open,
  setOpen,
  reactions,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  reactions: PartialReaction[];
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ paddingBottom: 0 }}>
        <SplitRow>
          <ReactionCount reactions={reactions} />
          <IconButton onClick={handleClose}>
            <ClearIcon></ClearIcon>
          </IconButton>{' '}
        </SplitRow>
      </DialogTitle>
      <DialogContent>
        {reactions?.map(reaction => (
          <Box key={reaction.id || reaction.createdDate.getTime()}>
            <hr></hr>
            <UserDisplay user={reaction.user}></UserDisplay>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ReactionsDialog;
