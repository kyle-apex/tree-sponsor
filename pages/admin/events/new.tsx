import Button from '@mui/material/Button';
import AddEvent from 'components/event/AddEvent';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import { PartialEvent } from 'interfaces';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import AdminLayout from 'components/layout/AdminLayout';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasEventManagement');
};

const AddEventPage = () => {
  const onAdd = (newEvent: PartialEvent) => {
    router.push('/admin/events/' + newEvent.path);
  };

  const router = useRouter();

  return (
    <AdminLayout title='Add Event'>
      <CenteredSection backButtonText='Back' headerText='Add Event'>
        <AddEvent onAdd={onAdd}></AddEvent>
      </CenteredSection>
    </AdminLayout>
  );
};
export default AddEventPage;
