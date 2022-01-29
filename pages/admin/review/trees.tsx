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

  const { data: trees, isFetched, refetch } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(reviewStatus), {
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
          {trees?.map(tree => (
            <Grid key={tree.id} item xs={12} sm={6} md={3}>
              <TreeRender id={tree.id} tree={tree}></TreeRender>
              <Card>
                <CardContent>
                  <TreeFormFields
                    tree={tree}
                    handleChange={(propertyName: string, value) => {
                      updateById(tree.id, { [propertyName]: value });
                      if (propertyName == 'speciesId') tree.speciesId = value as number;
                    }}
                  ></TreeFormFields>
                  <ReviewStatusSelect
                    label='Review Status'
                    value={tree.reviewStatus}
                    onChange={(value: ReviewStatus) => {
                      if (value !== '') {
                        tree.reviewStatus = value;
                        updateById(tree.id, { reviewStatus: value });
                      }
                    }}
                    mb={2}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </AdminLayout>
    </>
  );
};
export default ReviewTreesPage;
