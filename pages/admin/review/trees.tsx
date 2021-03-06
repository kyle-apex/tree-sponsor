import AdminLayout from 'components/layout/AdminLayout';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import { GetSessionOptions } from 'next-auth/client';
import React, { useCallback, useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { ReviewStatus, PartialTree } from 'interfaces';
import { useQuery } from 'react-query';
import parsedGet from 'utils/api/parsed-get';
import TreeFormFields from 'components/tree/TreeFormFields';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import axios from 'axios';
import { useUpdateQueryById } from 'utils/hooks';
import TreeRender from 'components/tree/TreeRender';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import LocationSelector from 'components/LocationSelector';
import TreeReview from 'components/tree/TreeReview';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isTreeReviewer');
};

async function fetchTrees(reviewStatusFilter = '') {
  const queryString = reviewStatusFilter ? '?take=8&reviewStatus=' + encodeURIComponent(reviewStatusFilter) : '';
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const ReviewTreesPage = () => {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('New');

  const apiKey = ['review-trees', reviewStatus];

  const { data: trees } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(reviewStatus), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const updateTree = async (id: number, attributes: Record<string, unknown>) => {
    await axios.patch('/api/trees/' + id, attributes);
  };

  const { updateById } = useUpdateQueryById(apiKey, updateTree, false, 500);
  // TODO refactor into memoized component to avoid re-render all when updating
  return (
    <>
      <AdminLayout title='Review Trees' header='Review Trees'>
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
                <TreeRender id={tree.id} tree={tree}></TreeRender>
                <Card>
                  <CardContent>
                    <TreeReview tree={tree} onUpdate={updateById} />
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
