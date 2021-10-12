import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import SponsorshipDisplay from './SponsorshipDisplay';
import { Sponsorship } from '@prisma/client';
import { makeStyles } from '@mui/styles';
import SponsorshipDisplayLoading from './SponsorshipDisplayLoading';
import parsedGet from 'utils/api/parsed-get';

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
    const result = await parsedGet<Sponsorship>(`/sponsorships/${id}`);
    setSponsorship(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) readSponsorship();
  }, [open, id]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px' } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        {isLoading ? (
          <SponsorshipDisplayLoading />
        ) : (
          <SponsorshipDisplay sponsorship={sponsorship} handleClose={handleClose} hasFullHeightImage={true} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipDisplayDialog;
