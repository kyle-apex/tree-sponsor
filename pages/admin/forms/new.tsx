import Button from '@mui/material/Button';
import AddForm from 'components/forms/AddForm';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import { PartialForm } from 'interfaces';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import AdminLayout from 'components/layout/AdminLayout';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasFormManagement');
};

const AddFormPage = () => {
  const onAdd = (_newForm: PartialForm) => {
    router.push('/admin/forms');
  };

  const router = useRouter();

  return (
    <AdminLayout title='Add Form'>
      <CenteredSection backButtonText='Back' headerText='Add Form' maxWidth='90%'>
        <AddForm onAdd={onAdd}></AddForm>
      </CenteredSection>
    </AdminLayout>
  );
};
export default AddFormPage;
