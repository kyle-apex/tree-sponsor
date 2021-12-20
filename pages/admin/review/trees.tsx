import { GetSessionOptions } from 'next-auth/client';
import React from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isTreeReviewer');
};

const ReviewTreesPage = () => {
  return <></>;
};
export default ReviewTreesPage;
