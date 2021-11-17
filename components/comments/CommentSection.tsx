import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/system/Box';
import { useSession } from 'next-auth/client';
import React, { useState } from 'react';
import AddComment from './AddComment';
import CommentDisplay from './CommentDisplay';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Session } from 'interfaces';
import { PartialComment } from 'interfaces';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import { useGet, useRemoveFromQuery } from 'utils/hooks';
import axios from 'axios';

const CommentSection = ({ sponsorshipId, signInCallbackUrl }: { sponsorshipId: number; signInCallbackUrl?: string }) => {
  const [session] = useSession();
  const [isAdding, setIsAdding] = useState(false);

  const { data: comments, isFetching: isCommentsFetching } = useGet<PartialComment[]>(
    `/api/sponsorships/${sponsorshipId}/comments`,
    `sponsorships/${sponsorshipId}/comments`,
  );

  const { add } = useAddToQuery<PartialComment>(`sponsorships/${sponsorshipId}/comments`, addCommentToDatabase);

  const addComment = async (text: string) => {
    setIsAdding(true);
    await add({ text, sponsorshipId: sponsorshipId, user: session.user, createdDate: new Date() });

    setIsAdding(false);
  };

  async function addCommentToDatabase(comment: PartialComment) {
    const newComment = { ...comment };
    delete newComment.user;
    const result = await axios.post(`/api/sponsorships/${sponsorshipId}/comments`, newComment);
    return result.data;
  }

  const { remove } = useRemoveFromQuery(`sponsorships/${sponsorshipId}/comments`, handleDeleteComment);

  async function handleDeleteComment(id: number) {
    await axios.delete('/api/comments/' + id);
  }
  return (
    <Box sx={{ padding: 2, height: '100%' }} className='section-background full-width'>
      {isCommentsFetching ? (
        <>
          <Skeleton variant='text' sx={{ width: '100%' }} />
          <Skeleton variant='text' sx={{ width: '75%' }} />
        </>
      ) : (
        <>
          {!session && (
            <Box mb={2}>
              <Link href={signInCallbackUrl ? '/signin?callbackUrl=' + signInCallbackUrl : '/signin'}>
                <a style={{ textDecoration: 'none' }}>
                  <Box flexDirection='row' sx={{ display: 'flex' }} gap={0.5}>
                    <Typography color='primary'>Login to leave a comment</Typography>
                    <ChevronRight color='primary' />
                  </Box>
                </a>
              </Link>
            </Box>
          )}
          {session && <AddComment isAdding={isAdding} onAdd={addComment}></AddComment>}
          {comments?.map(comment => (
            <>
              <hr />
              <CommentDisplay
                key={comment.id || comment.text}
                comment={comment}
                currentUserId={(session as Session)?.user?.id}
                onDelete={remove}
              ></CommentDisplay>
            </>
          ))}
        </>
      )}
    </Box>
  );
};
export default CommentSection;
