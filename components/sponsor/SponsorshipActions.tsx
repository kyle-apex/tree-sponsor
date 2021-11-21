import CommentSection from 'components/comments/CommentSection';
import React, { useState } from 'react';
import { useGet } from 'utils/hooks/use-get';
import { PartialComment, PartialReaction } from 'interfaces';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/system/Box';
import ReactionButton from 'components/reactions/ReactionButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatIcon from '@mui/icons-material/Chat';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ChevronRight from '@mui/icons-material/ChevronRight';

const SponsorshipActions = ({ sponsorshipId, signInCallbackUrl }: { sponsorshipId: number; signInCallbackUrl?: string }) => {
  const [showComments, setShowComments] = useState(false);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const { data: comments, isFetching: isCommentsFetching } = useGet<PartialComment[]>(
    `/api/sponsorships/${sponsorshipId}/comments`,
    `sponsorships/${sponsorshipId}/comments`,
  );

  const { data: reactions, isFetching } = useGet<PartialReaction[]>(
    `/api/sponsorships/${sponsorshipId}/reactions`,
    `sponsorships/${sponsorshipId}/reactions`,
  );

  return (
    <Box flexDirection='column' className='full-width'>
      <Box flexDirection='row' sx={{ padding: 2 }}>
        <hr />
        <ReactionButton
          sponsorshipId={sponsorshipId}
          reactions={reactions}
          onUnauthenticated={() => setUnauthenticated(!unauthenticated)}
        ></ReactionButton>

        <Button
          sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
          onClick={() => {
            setShowComments(!showComments);
          }}
        >
          {comments?.length > 0 ? <ChatIcon /> : <ChatBubbleOutlineIcon />}
          <Typography sx={{ marginLeft: 1 }}>{comments?.length || 0}</Typography>
        </Button>
        {!showComments && unauthenticated && (
          <Box mb={1} mt={2}>
            <Link href={signInCallbackUrl ? '/signin?callbackUrl=' + signInCallbackUrl : '/signin'}>
              <a style={{ textDecoration: 'none' }}>
                <Box flexDirection='row' sx={{ display: 'flex' }} gap={0.5}>
                  <Typography color='primary'>Login to react to trees</Typography>
                  <ChevronRight color='primary' />
                </Box>
              </a>
            </Link>
          </Box>
        )}
      </Box>

      {showComments && <CommentSection sponsorshipId={sponsorshipId} comments={comments} isFetching={isCommentsFetching}></CommentSection>}
    </Box>
  );
};
export default SponsorshipActions;
