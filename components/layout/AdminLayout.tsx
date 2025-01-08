import Button from '@mui/material/Button';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Layout from './Layout';
import SplitRow from './SplitRow';
import NavigationMenu from 'components/admin/NavigationMenu';

const AdminLayout = ({ children, title, header }: { children?: ReactNode; title?: string; header?: string | ReactNode }) => {
  return (
    <Layout title={title}>
      <SplitRow>
        <Link href='/admin/'>
          <Button variant='outlined'>Back to Admin Home</Button>
        </Link>
        <NavigationMenu></NavigationMenu>
      </SplitRow>

      <h1>{header}</h1>
      {children}
    </Layout>
  );
};
export default AdminLayout;
