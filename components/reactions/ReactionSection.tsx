import React, { useState } from 'react';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { PartialReaction } from 'interfaces';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Session } from 'interfaces';

const ReactSection = ({ sponsorshipId }: { sponsorshipId: number }) => {
  const [session] = useSession();
  const [isAdding, setIsAdding] = useState(false);

  const { data: reactions, isFetching } = useGet<PartialReaction[]>(
    `/api/sponsorships/${sponsorshipId}/reactions`,
    `sponsorships/${sponsorshipId}/reactions`,
  );

  const { add } = useAddToQuery<PartialReaction>(`sponsorships/${sponsorshipId}/reactions`, addToDatabase);

  const addReaction = async () => {
    setIsAdding(true);
    await add({ type: 'like', sponsorshipId: sponsorshipId, userId: session.user.id, user: session.user, createdDate: new Date() });

    setIsAdding(false);
  };

  async function addToDatabase(comment: PartialReaction) {
    const newComment = { ...comment };
    delete newComment.user;
    const result = await axios.post(`/api/sponsorships/${sponsorshipId}/reactions`, newComment);
    return result.data;
  }

  const { remove } = useRemoveFromQuery(`sponsorships/${sponsorshipId}/reactions`, handleDelete);

  async function handleDelete(id: number) {
    await axios.delete('/api/reactions/' + id);
  }
  console.log('reactions', reactions);
  const currentUserReaction = reactions?.find(reaction => (session as Session)?.user?.id === reaction.userId);

  return (
    <>
      {reactions?.length || 0}
      {currentUserReaction && (
        <IconButton onClick={() => remove(currentUserReaction.id)}>
          <ThumbUpIcon color='primary'></ThumbUpIcon>
        </IconButton>
      )}
      {!currentUserReaction && (
        <IconButton onClick={addReaction}>
          <ThumbUpIcon></ThumbUpIcon>
        </IconButton>
      )}
    </>
  );
};
export default ReactSection;
