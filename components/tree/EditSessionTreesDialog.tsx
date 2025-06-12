import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CheckinSessionContext } from 'components/event/CheckinSessionProvider';
import { PartialTree, PartialUser, Session } from 'interfaces';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';
import useEditTree from 'utils/hooks/use-edit-tree';
import useLocalStorage from 'utils/hooks/use-local-storage';
import AddTreeForm from './AddTreeForm';
import TreeReview from './TreeReview';
import { signIn, useSession } from 'next-auth/client';

async function fetchTrees(sessionId = '', eventId: number | null = null, isTreeReviewer = false) {
  // If no sessionId and not a tree reviewer, return empty array
  if (!sessionId && !isTreeReviewer) return [];

  // If no eventId but user is a tree reviewer, we still need an eventId to fetch all trees
  if (!eventId && isTreeReviewer) {
    console.warn('Tree reviewer role detected but no eventId provided');
  }

  // If user is a tree reviewer and we have an eventId, fetch all trees for the event
  if (isTreeReviewer && eventId) {
    const trees = await parsedGet<PartialTree[]>(`/api/events/${eventId}/trees`);

    // If we also have a sessionId, fetch session trees to prioritize them
    if (sessionId) {
      const sessionTrees = await parsedGet<PartialTree[]>('/api/trees?sessionId=' + encodeURIComponent(sessionId));

      // Create a map of session tree IDs for quick lookup
      const sessionTreeIds = new Set(sessionTrees.map(tree => tree.id));

      // Filter out session trees from the event trees to avoid duplicates
      const otherTrees = trees.filter(tree => !sessionTreeIds.has(tree.id));

      // Return session trees first, followed by other trees
      return [...sessionTrees, ...otherTrees];
    }

    return trees;
  }

  // Default behavior - just fetch session trees
  const queryString = '?sessionId=' + encodeURIComponent(sessionId);
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const EditSessionTreesDialog = ({
  isOpen,
  setIsOpen,
  onComplete,
  eventId,
  hasTreeReviewerRole = false,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete?: () => void;
  eventId?: number;
  hasTreeReviewerRole?: boolean;
}) => {
  const { sessionId } = useContext(CheckinSessionContext);
  const [session] = useSession();
  const [isTreeReviewer, setIsTreeReviewer] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  // Check if the user has the isTreeReviewer role
  useEffect(() => {
    // Otherwise check if the logged-in user has the role
    const extendedSession = session as Session;
    if (extendedSession?.user?.roles) {
      setIsTreeReviewer(extendedSession.user.roles.some(role => role.isTreeReviewer || role.isAdmin));
    }
  }, [session, hasTreeReviewerRole]);

  const apiKey = ['session-trees', sessionId, eventId, isTreeReviewer];

  const {
    data: trees,
    refetch: refetchTrees,
    isFetching,
    isFetched,
  } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(sessionId, eventId, isTreeReviewer), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isOpen && !isFetching) refetchTrees();
  }, [isOpen]);

  const { handleUpdateById, handleDelete, handleDeleteImage } = useEditTree(apiKey, refetchTrees);

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className=''>
        <Typography mb={0} variant='h2' color='secondary'>
          Edit Tree(s)
        </Typography>

        {isFetched && !trees?.length && (
          <Typography mb={0} mt={2} variant='body1'>
            No trees available to edit for this event.{' '}
            {!session && hasTreeReviewerRole ? 'Please login to manage trees.' : 'Please login to manage your added trees.'}
          </Typography>
        )}

        <Grid container spacing={4} mt={-1}>
          {trees?.map(tree => {
            return (
              <Grid key={tree.id} item xs={12} sm={12}>
                <Card sx={{ '.MuiCardContent-root': { padding: 0, paddingBottom: 0 } }}>
                  <CardContent sx={{ pb: '0 !important' }}>
                    <TreeReview
                      tree={tree}
                      onUpdate={handleUpdateById}
                      onDelete={handleDelete}
                      onDeleteImage={handleDeleteImage}
                      onRefetch={refetchTrees}
                      isAdmin={false}
                      isForQuiz={true}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        {!session && hasTreeReviewerRole && (
          <>
            <Typography mb={2} mt={2} variant='body1'>
              To view and edit all trees for this event, please login with your email address:
            </Typography>
            <Button
              color='secondary'
              variant='contained'
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => signIn('', { callbackUrl: '/checkin', redirect: true })}
            >
              Login to Edit Trees
            </Button>
          </>
        )}
        <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default EditSessionTreesDialog;
