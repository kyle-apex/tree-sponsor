import { ReviewStatus } from 'interfaces';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import AdminLayout from 'components/layout/AdminLayout';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import React, { useState } from 'react';

// List of sponsorship cards ordered by most recent
// Filter for review statuses that defaults to those in New/Draft/Modified
// Ability to open edit dialog and make changes
// Display should have the reivew status seletor at the bottom of the card to allow changing
// page only viewable to those with review permissions

const ReviewSponsorshipsPage = () => {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('New');
  return (
    <AdminLayout title='Review Thank-a-Trees' header='Review Thank-a-Trees'>
      <ReviewStatusSelect
        emptyLabel='All'
        value={reviewStatus}
        onChange={setReviewStatus}
        label='Filter by Status'
        mb={2}
      ></ReviewStatusSelect>
      <Sponsorships isReview={true} reviewStatusFilter={reviewStatus}></Sponsorships>
    </AdminLayout>
  );
};
export default ReviewSponsorshipsPage;
