import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SponsorshipDisplay from './SponsorshipDisplay';
import makeStyles from '@mui/styles/makeStyles';
import SponsorshipDisplayLoading from './SponsorshipDisplayLoading';
import parsedGet from 'utils/api/parsed-get';
import CommentSection from 'components/comments/CommentSection';
import { PartialComment, PartialSponsorship } from 'interfaces';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import { useGet } from 'utils/hooks';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const SponsorshipDisplayDialog = ({ open, setOpen, id }: { open: boolean; setOpen: (isOpen: boolean) => void; id: number }) => {
  const classes = useStyles();
  const [sponsorship, setSponsorship] = useState<PartialSponsorship>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(true);

  const readSponsorship = async () => {
    setIsLoading(true);
    const result = await parsedGet<PartialSponsorship>(`/sponsorships/${id}`);
    setSponsorship(result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) readSponsorship();
  }, [open, id]);

  const handleClose = () => {
    setOpen(false);
  };

  const { data: roles, refetch: refetchRoles, isFetching: isRolesFetching } = useGet<PartialComment[]>(
    `/api/sponsorship/${sponsorship.id}/comments`,
    `sponsorship/${sponsorship.id}/comments`,
  );

  const { add } = useAddToQuery<PartialComment>('rsponsorship/${sponsorship.id}/comments', addCommentToDatabase);

  const addComment = (text: string) => {
    setIsAddingComment(true);
    add({ text, sponsorshipId: sponsorship.id });
    setIsAddingComment(false);
  };

  async function addCommentToDatabase(comment: PartialComment) {
    const result = await axios.post('/api/comments', comment);
    return result.data;
  }

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px' } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        {isLoading ? (
          <SponsorshipDisplayLoading />
        ) : (
          <>
            <SponsorshipDisplay sponsorship={sponsorship} handleClose={handleClose} hasFullHeightImage={true} />
            <CommentSection comments={sponsorship?.comments} onAdd={addComment} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipDisplayDialog;
