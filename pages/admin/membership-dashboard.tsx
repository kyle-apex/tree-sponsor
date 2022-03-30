import Box from '@mui/material/Box';
import MembershipChart from 'components/admin/MembershipChart';
import MembershipStats from 'components/admin/MembershipStats';
import AdminLayout from 'components/layout/AdminLayout';

const MembershipDashboardPage = () => {
  return (
    <AdminLayout title='Membership Dashboard' header='Membership Dashboard'>
      <MembershipStats></MembershipStats>
    </AdminLayout>
  );
};
export default MembershipDashboardPage;
