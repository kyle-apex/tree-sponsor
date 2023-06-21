import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const BecomeAMemberDialog = ({ open, setOpen }: { open: boolean; setOpen: (isOpen: boolean) => void }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }}>
      <DialogTitle sx={{ paddingBottom: 0 }}>
        <SplitRow>
          <>Wait!</>
          <IconButton onClick={handleClose}>
            <ClearIcon></ClearIcon>
          </IconButton>
        </SplitRow>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' component='p' mt={2} mb={2}>
          Adding tree identifications is limitted to TreeFolks Young Professionals supporting members.
        </Typography>
        <Typography variant='body2' component='p' mb={3}>
          Become a supporting member today with an annual donation to TreeFolks starting at $20/yr:
        </Typography>
        <Link href='/membership'>
          <Button color='primary' variant='contained' fullWidth sx={{ mb: 2 }}>
            Become a Member
          </Button>
        </Link>
        <Button fullWidth color='inherit' onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeAMemberDialog;
