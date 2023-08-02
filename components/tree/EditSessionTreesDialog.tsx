import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PartialTree } from 'interfaces';
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
  const [sessionId] = useLocalStorage('sessionId', '');
  const handleClose = () => {
    setIsOpen(false);
  };

  const apiKey = ['session-trees', sessionId];

  const { data: trees, refetch: refetchTrees } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { handleUpdateById, handleDelete, handleDeleteImage } = useEditTree(apiKey, refetchTrees);

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogContent className=''>
        <Typography mb={3} variant='h2'>
          Edit Trees
        </Typography>
        <Grid container spacing={4} mt={-1}>
          {trees?.map(tree => {
            return (
              <Grid key={tree.id} item xs={12} sm={6}>
                <Card sx={{ '.MuiCardContent-root': { padding: 0, paddingBottom: 0 } }}>
                  <CardContent sx={{ pb: '0 !important' }}>
                    <TreeReview
                      tree={tree}
                      onUpdate={handleUpdateById}
                      onDelete={handleDelete}
                      onDeleteImage={handleDeleteImage}
                      onRefetch={refetchTrees}
                      isAdmin={false}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default EditSessionTreesDialog;
