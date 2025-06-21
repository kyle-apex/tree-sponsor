import Box from '@mui/material/Box';
import EventAttendanceStats from 'components/admin/EventAttendanceStats';
import AdminLayout from 'components/layout/AdminLayout';

const EventDashboardPage = () => {
  return (
    <AdminLayout title='Event Dashboard' header='Event Dashboard'>
      <EventAttendanceStats />
    </AdminLayout>
  );
};

export default EventDashboardPage;
