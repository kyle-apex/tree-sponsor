import Box from '@mui/material/Box';
import MembershipChart from 'components/admin/MembershipChart';
import MembershipStats from 'components/admin/MembershipStats';
import AdminLayout from 'components/layout/AdminLayout';

const MembershipDashboardPage = () => {
  return (
    <AdminLayout title='Membership Dashboard' header='Membership Dashboard'>
      <MembershipStats></MembershipStats>
      <hr style={{ marginTop: '26px', marginBottom: '26px' }} />
      <Box sx={{ maxHeight: '400px' }}>
        <MembershipChart></MembershipChart>
      </Box>
    </AdminLayout>
  );
};
export default MembershipDashboardPage;
