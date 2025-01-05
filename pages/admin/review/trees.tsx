import AdminLayout from 'components/layout/AdminLayout';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import { GetSessionOptions } from 'next-auth/client';
import React, { useCallback, useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import AddIcon from '@mui/icons-material/Add';

import { ReviewStatus, PartialTree } from 'interfaces';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';
import TreeFormFields from 'components/tree/TreeFormFields';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import axios from 'axios';
import { useRemoveFromQuery, useUpdateQueryById } from 'utils/hooks';
import TreeReview from 'components/tree/TreeReview';
import AddTreeDialog from 'components/tree/AddTreeDialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import SplitRow from 'components/layout/SplitRow';
import useEditTree from 'utils/hooks/use-edit-tree';
import usePagination from 'utils/hooks/use-pagination';
import IdentifyTreeFlowDialog from 'components/tree/IdentifyTreeFlowDialog';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isTreeReviewer');
};

async function fetchTrees(reviewStatusFilter = '') {
  const queryString = reviewStatusFilter ? '?reviewStatus=' + encodeURIComponent(reviewStatusFilter) : '';
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const ReviewTreesPage = () => {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('New');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination(8);

  const apiKey = ['review-trees', reviewStatus];

  const { data: trees, refetch: refetchTrees } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(reviewStatus), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { handleUpdateById, handleDelete, handleDeleteImage } = useEditTree(apiKey, refetchTrees);

  // TODO refactor into memoized component to avoid re-render all when updating
  return (
    <>
      <AdminLayout
        title='Manage Trees'
        header={
          <Box component='div' flexDirection='row' sx={{ display: 'flex', alignItems: 'center' }} justifyContent='space-between'>
            <span>Manage Trees</span>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
              startIcon={<AddIcon />}
              variant='contained'
              sx={{ width: '120px', height: '36.5px' }}
              size='small'
            >
              Add Tree
            </Button>
          </Box>
        }
      >
        <IdentifyTreeFlowDialog
          setOpen={setIsDialogOpen}
          open={isDialogOpen}
          onComplete={refetchTrees}
          preventSkipLeafPicture={true}
        ></IdentifyTreeFlowDialog>
        <ReviewStatusSelect
          emptyLabel='All'
          value={reviewStatus}
          onChange={setReviewStatus}
          label='Filter by Status'
          mb={2}
        ></ReviewStatusSelect>
        <SplitRow alignItems='center' mobileFlexDirection='column'>
          <></>
          <Box>
            <TablePagination
              rowsPerPageOptions={[8, 16, 32]}
              component='div'
              count={trees?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Trees per page:'
            />
          </Box>
        </SplitRow>
        <Grid container spacing={4}>
          {trees?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(tree => {
            return (
              <Grid key={tree.id} item xs={12} sm={6} md={3}>
                <Card sx={{ '.MuiCardContent-root': { padding: 0, paddingBottom: 0 } }}>
                  <CardContent sx={{ pb: '0 !important' }}>
                    <TreeReview
                      tree={tree}
                      onUpdate={handleUpdateById}
                      onDelete={handleDelete}
                      isAdmin={true}
                      onDeleteImage={handleDeleteImage}
                      onRefetch={refetchTrees}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </AdminLayout>
    </>
  );
};
export default ReviewTreesPage;
