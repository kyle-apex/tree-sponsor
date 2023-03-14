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
import TreeRender from 'components/tree/TreeRender';
import TreeReview from 'components/tree/TreeReview';
import AddTreeDialog from 'components/tree/AddTreeDialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isTreeReviewer');
};

async function fetchTrees(reviewStatusFilter = '') {
  const queryString = reviewStatusFilter ? '?take=8&reviewStatus=' + encodeURIComponent(reviewStatusFilter) : '';
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const ReviewTreesPage = () => {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('New');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const apiKey = ['review-trees', reviewStatus];

  const { data: trees, refetch: refetchTrees } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(reviewStatus), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const updateTree = async (id: number, attributes: Record<string, unknown>) => {
    await axios.patch('/api/trees/' + id, attributes);
  };

  const { updateById } = useUpdateQueryById(apiKey, updateTree, false, 500);

  const { remove } = useRemoveFromQuery<PartialTree>(apiKey, handleDelete);

  async function handleDelete(treeId: number) {
    await axios.delete('/api/trees/' + treeId);
    refetchTrees();
  }
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
        <AddTreeDialog setIsOpen={setIsDialogOpen} isOpen={isDialogOpen} onComplete={refetchTrees}></AddTreeDialog>
        <ReviewStatusSelect
          emptyLabel='All'
          value={reviewStatus}
          onChange={setReviewStatus}
          label='Filter by Status'
          mb={2}
        ></ReviewStatusSelect>
        <Grid container spacing={4}>
          {trees?.map(tree => {
            return (
              <Grid key={tree.id} item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <TreeReview tree={tree} onUpdate={updateById} onDelete={handleDelete} />
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
