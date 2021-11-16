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
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/client';

const useStyles = makeStyles(theme => ({
  title: { paddingBottom: 0, paddingTop: theme.spacing(1), paddingRight: theme.spacing(1), textAlign: 'right' },
  content: {},
}));

const SponsorshipDisplayDialog = ({ open, setOpen, id }: { open: boolean; setOpen: (isOpen: boolean) => void; id: number }) => {
  const classes = useStyles();
  const [session] = useSession();
  const [sponsorship, setSponsorship] = useState<PartialSponsorship>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

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

  const { data: comments, refetch: refetchComments, isFetching: isCommentsFetching } = useGet<PartialComment[]>(
    `/api/sponsorships/${id}/comments`,
    `sponsorships/${id}/comments`,
  );

  const { add } = useAddToQuery<PartialComment>(`sponsorships/${id}/comments`, addCommentToDatabase);

  const addComment = async (text: string) => {
    setIsAddingComment(true);
    await add({ text, sponsorshipId: sponsorship.id, user: session.user, createdDate: new Date() });
    //refetchComments();
    setIsAddingComment(false);
  };

  async function addCommentToDatabase(comment: PartialComment) {
    const newComment = { ...comment };
    delete newComment.user;
    const result = await axios.post(`/api/sponsorships/${id}/comments`, newComment);
    return result.data;
  }

  const { remove } = useRemoveFromQuery(`sponsorships/${id}/comments`, handleDeleteComment);

  async function handleDeleteComment(id: number) {
    await axios.delete('/api/comments/' + id);
  }

  return (
    <Dialog open={open} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px' } }} onClose={handleClose}>
      <DialogContent sx={{ padding: 0 }} className={classes.content}>
        {isLoading ? (
          <SponsorshipDisplayLoading />
        ) : (
          <>
            <SponsorshipDisplay sponsorship={sponsorship} handleClose={handleClose} hasFullHeightImage={true} />
            <CommentSection
              isLoading={isCommentsFetching}
              comments={comments}
              onAdd={addComment}
              isAdding={isAddingComment}
              onDelete={remove}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipDisplayDialog;
