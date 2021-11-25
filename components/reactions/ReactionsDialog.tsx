import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReactionCount from './ReactionCount';
import { PartialReaction } from 'interfaces';
import { UserAvatar } from 'components/sponsor';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';

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
          <>
            <hr></hr>
            <Box
              key={reaction.id}
              sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', paddingRight: 1, paddingLeft: 1 }}
              gap={2}
            >
              <UserAvatar
                name={reaction.user?.displayName || reaction.user?.name}
                image={reaction.user?.image}
                link={reaction.user?.profilePath ? '/u/' + reaction.user.profilePath : ''}
                size={36}
              />{' '}
              {reaction.user?.displayName || reaction.user?.name}
            </Box>
          </>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ReactionsDialog;
