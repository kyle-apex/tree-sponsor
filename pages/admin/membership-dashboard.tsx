import Box from '@mui/material/Box';
import MembershipChart from 'components/admin/MembershipChart';
import MembershipStats from 'components/admin/MembershipStats';
import Layout from 'components/layout/Layout';

const MembershipDashboardPage = () => {
  return (
    <Layout title='Membership Dashboard'>
      <h1>Membership Dashboard</h1>
      <MembershipStats></MembershipStats>
      <hr style={{ marginTop: '26px', marginBottom: '26px' }} />
      <Box sx={{ maxHeight: '400px' }}>
        <MembershipChart></MembershipChart>
      </Box>
    </Layout>
  );
};
export default MembershipDashboardPage;
