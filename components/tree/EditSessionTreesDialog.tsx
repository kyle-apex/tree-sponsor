import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CheckinSessionContext } from 'components/event/CheckinSessionProvider';
import { PartialTree } from 'interfaces';
import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';
import useEditTree from 'utils/hooks/use-edit-tree';
import useLocalStorage from 'utils/hooks/use-local-storage';
import AddTreeForm from './AddTreeForm';
import TreeReview from './TreeReview';

async function fetchTrees(sessionId = '') {
  if (!sessionId) return [];
  const queryString = '?sessionId=' + encodeURIComponent(sessionId);
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const EditSessionTreesDialog = ({
  isOpen,
  setIsOpen,
  onComplete,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete?: () => void;
}) => {
  const { sessionId } = useContext(CheckinSessionContext);
  const handleClose = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const apiKey = ['session-trees', sessionId];

  const {
    data: trees,
    refetch: refetchTrees,
    isFetching,
    isFetched,
  } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(sessionId), {
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
            No tree available to edit for this event Please login to manage your added trees.
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
        <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default EditSessionTreesDialog;
