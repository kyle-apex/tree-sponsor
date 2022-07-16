import Box from '@mui/material/Box';
import FundraisingStats from 'components/admin/FundraisingStats';

import AdminLayout from 'components/layout/AdminLayout';

const FundraisingDashboardPage = () => {
  return (
    <AdminLayout title='Fundraising Dashboard' header='Fundraising Dashboard'>
      <FundraisingStats></FundraisingStats>
    </AdminLayout>
  );
};
export default FundraisingDashboardPage;
