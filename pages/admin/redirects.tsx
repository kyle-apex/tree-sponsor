import SubdomainRedirects from 'components/admin/SubdomainRedirects';
import AdminLayout from 'components/layout/AdminLayout';
import { GetSessionOptions } from 'next-auth/client';
import restrictPageAccess from 'utils/auth/restrict-page-access';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasRedirectManagement');
};

const RedirectsPage = () => {
  return (
    <AdminLayout title='Manage Redirects' header='Manage Redirects'>
      <SubdomainRedirects></SubdomainRedirects>
    </AdminLayout>
  );
};
export default RedirectsPage;
