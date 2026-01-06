import Box from '@mui/material/Box';
import EventAttendanceStats from 'components/admin/EventAttendanceStats';
import AdminLayout from 'components/layout/AdminLayout';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';

const EventDashboardPage = () => {
  return (
    <AdminLayout title='Event Dashboard' header='Event Dashboard'>
      <EventAttendanceStats />
    </AdminLayout>
  );
};

export default EventDashboardPage;

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isAdmin');
};
