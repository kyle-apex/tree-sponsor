import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/system/Box';
import { useSession } from 'next-auth/client';
import React from 'react';
import AddComment from './AddComment';
import CommentDisplay from './CommentDisplay';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Session } from 'interfaces';

const CommentSection = ({
  comments,
  onAdd,
  isLoading,
  isAdding,
  onDelete,
  signInCallbackUrl,
}: {
  comments: any[];
  onAdd?: (text: string) => void;
  isLoading?: boolean;
  isAdding?: boolean;
  onDelete?: (id: number) => void;
  signInCallbackUrl?: string;
}) => {
  const [session] = useSession();
  return (
    <Box sx={{ padding: 2 }} className='section-background'>
      {isLoading ? (
        <>
          <Skeleton variant='text' sx={{ width: '100%' }} />
          <Skeleton variant='text' sx={{ width: '75%' }} />
        </>
      ) : (
        <>
          {onAdd && session && <AddComment isAdding={isAdding} onAdd={onAdd}></AddComment>}
          {comments?.map((comment, idx) => (
            <>
              {!(!session && idx === 0) && <hr />}
              <CommentDisplay
                key={comment.id || comment.text}
                comment={comment}
                currentUserId={(session as Session)?.user?.id}
                onDelete={onDelete}
              ></CommentDisplay>
            </>
          ))}
          {onAdd && !session && (
            <>
              <hr />
              <Box mb={2} mt={3}>
                <Link href={signInCallbackUrl ? '/signin?callbackUrl=' + signInCallbackUrl : '/signin'}>
                  <a style={{ textDecoration: 'none' }}>
                    <Box flexDirection='row' sx={{ display: 'flex' }} gap={0.5}>
                      <Typography color='primary'>Login to leave a comment</Typography>
                      <ChevronRight color='primary' />
                    </Box>
                  </a>
                </Link>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};
export default CommentSection;
