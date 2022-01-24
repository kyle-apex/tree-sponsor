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

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isTreeReviewer');
};

async function fetchTrees(reviewStatusFilter = '') {
  const queryString = reviewStatusFilter ? '?reviewStatus=' + encodeURIComponent(reviewStatusFilter) : '';
  return parsedGet<PartialTree[]>('/api/trees' + queryString);
}

const ReviewTreesPage = () => {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('New');

  const apiKey = ['review-trees', reviewStatus];

  const { data: trees, isFetched, refetch } = useQuery<PartialTree[]>(apiKey, () => fetchTrees(reviewStatus), {
    keepPreviousData: true,
  });

  const { updateById } = useUpdateQueryById(apiKey, updateTree);

  const updateTree = async (id: number, attributes: Record<string, unknown>) => {
    await axios.patch('/api/tree/' + id, { reviewStatus: attributes.reviewStatus });
  };


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
              <Card>
                <CardContent>
                  <TreeFormFields tree={tree} handleChange={(propertyName,value) => updateTree(tree.id,{[propertyName]:value})}></TreeFormFields>
                  <ReviewStatusSelect
                    value={tree.reviewStatus}
                    onChange={(value: ReviewStatus) => {
                      if (value !== '') {
                        tree.reviewStatus = value;
                        updateById(sponsorship.id, { reviewStatus: value });
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
