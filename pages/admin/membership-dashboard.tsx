import Box from '@mui/material/Box';
import MembershipChart from 'components/admin/MembershipChart';
import MembershipStats from 'components/admin/MembershipStats';

import AdminLayout from 'components/layout/AdminLayout';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';

const MembershipDashboardPage = () => {
  return (
    <AdminLayout title='Membership Dashboard' header='Membership Dashboard'>
      <MembershipStats></MembershipStats>
    </AdminLayout>
  );
};
export default MembershipDashboardPage;

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isAdmin');
};
