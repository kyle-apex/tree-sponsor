import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import SponsorshipDisplay from './SponsorshipDisplay';
import { Sponsorship } from '@prisma/client';
import axios from 'axios';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { Clear } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import SponsorshipDisplayLoading from './SponsorshipDisplayLoading';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const SponsorshipDisplayDialog = ({ open, setOpen, id }: { open: boolean; setOpen: (isOpen: boolean) => void; id: number }) => {
  const classes = useStyles();
  const [sponsorship, setSponsorship] = useState<Sponsorship>();
  const [isLoading, setIsLoading] = useState(false);

  const readSponsorship = async () => {
    setIsLoading(true);
    const result = await axios.get(`/api/sponsorships/${id}`);
    setSponsorship(parseResponseDateStrings(result.data));
    setIsLoading(false);
  };

  useEffect(() => {
    //if (sponsorship?.id != id) setSponsorship(null);
    if (open) readSponsorship();
  }, [open, id]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px' } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        {isLoading ? <SponsorshipDisplayLoading /> : <SponsorshipDisplay sponsorship={sponsorship} handleClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipDisplayDialog;
