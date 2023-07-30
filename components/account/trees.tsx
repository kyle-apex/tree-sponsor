import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SplitRow from 'components/layout/SplitRow';
import AddIcon from '@mui/icons-material/Add';
import AddTreeDialog from 'components/tree/AddTreeDialog';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';
import { PartialTree } from 'interfaces';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TreeReview from 'components/tree/TreeReview';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import IdentifyTreeFlowDialog from 'components/tree/IdentifyTreeFlowDialog';
import useEditTree from 'utils/hooks/use-edit-tree';
import usePagination from 'utils/hooks/use-pagination';

async function fetchTrees() {
  const queryString = ''; //`?take=0`;
  return parsedGet<PartialTree[]>('/api/me/trees' + queryString);
}

const apiKey = ['my-trees', 'review'];

const AccountTrees = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination(8);

  const { data: trees, refetch: refetchTrees } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { handleUpdateById, handleDelete, handleDeleteImage } = useEditTree(apiKey, refetchTrees);

  return (
    <Box>
      <IdentifyTreeFlowDialog setOpen={setIsDialogOpen} open={isDialogOpen} onComplete={refetchTrees}></IdentifyTreeFlowDialog>
      {trees?.length == 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography mb={3}>Take a picture of a tree, then click below to add your first tree identification:</Typography>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
            startIcon={<SearchIcon />}
            variant='contained'
            sx={{ width: '300px', maxWidth: '100%' }}
            size='large'
          >
            Identify a Tree
          </Button>
        </Box>
      )}
      {trees?.length > 0 && (
        <SplitRow alignItems='center' mobileFlexDirection='column'>
          <Typography variant='h2' color='secondary'>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
              startIcon={<SearchIcon />}
              variant='contained'
              sx={{ width: '300px', maxWidth: '100%' }}
              size='large'
            >
              Identify a Tree
            </Button>
          </Typography>
          <Box>
            <TablePagination
              rowsPerPageOptions={[8, 16, 32]}
              component='div'
              count={trees?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Trees per page:'
            />
          </Box>
        </SplitRow>
      )}
      {false && <AddTreeDialog setIsOpen={setIsDialogOpen} isOpen={isDialogOpen} onComplete={refetchTrees}></AddTreeDialog>}

      <Grid container spacing={4} mt={-1}>
        {trees?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(tree => {
          return (
            <Grid key={tree.id} item xs={12} sm={6} md={3}>
              <Card sx={{ '.MuiCardContent-root': { padding: 0, paddingBottom: 0 } }}>
                <CardContent sx={{ pb: '0 !important' }}>
                  <TreeReview
                    tree={tree}
                    onUpdate={handleUpdateById}
                    onDelete={handleDelete}
                    onDeleteImage={handleDeleteImage}
                    onRefetch={refetchTrees}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export default AccountTrees;
