import React, { useState } from 'react';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { PartialReaction } from 'interfaces';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Session } from 'interfaces';
import Typography from '@mui/material/Typography';

const ReactButton = ({
  sponsorshipId,
  reactions,
  onUnauthenticated,
}: {
  sponsorshipId: number;
  reactions: PartialReaction[];
  onUnauthenticated: () => void;
}) => {
  const [session] = useSession();
  const [isAdding, setIsAdding] = useState(false);

  const { add } = useAddToQuery<PartialReaction>(`sponsorships/${sponsorshipId}/reactions`, addToDatabase);

  const addReaction = async () => {
    if (!(session as Session)?.user?.id) {
      return onUnauthenticated();
    }
    setIsAdding(true);
    await add({
      type: 'like',
      sponsorshipId: sponsorshipId,
      userId: (session as Session).user.id,
      user: session.user,
      createdDate: new Date(),
    });

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
  console.log('cur', currentUserReaction);

  return (
    <>
      {currentUserReaction && (
        <Button onClick={() => remove(currentUserReaction.id)} color='info'>
          <ThumbUpIcon></ThumbUpIcon>
          <Typography sx={{ marginLeft: 1, textTransform: 'none' }}>Like</Typography>
        </Button>
      )}
      {!currentUserReaction && (
        <Button onClick={addReaction} sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
          <ThumbUpIcon></ThumbUpIcon>
          <Typography sx={{ marginLeft: 1, textTransform: 'none' }}>Like</Typography>
        </Button>
      )}
    </>
  );
};
export default ReactButton;
