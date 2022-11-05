import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TreeDisplay from './TreeDisplay';
import makeStyles from '@mui/styles/makeStyles';
import SponsorshipDisplayLoading from '../sponsor/SponsorshipDisplayLoading';
import { PartialTree } from 'interfaces';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const TreeDisplayDialog = ({ open, setOpen, tree }: { open: boolean; setOpen: (isOpen: boolean) => void; tree: PartialTree }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: 2 } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        {isLoading ? (
          <SponsorshipDisplayLoading />
        ) : (
          <>
            <TreeDisplay tree={tree} handleClose={handleClose} hasFullHeightImage={true} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TreeDisplayDialog;
