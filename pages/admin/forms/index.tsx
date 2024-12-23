import { PartialForm } from 'interfaces';
import AdminLayout from 'components/layout/AdminLayout';
import React, { useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import FormsTable from 'components/admin/FormsTable';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import LoadingButton from 'components/LoadingButton';
import Link from 'next/link';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasFormManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/forms/' + id);
}

const ManageFormsPage = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: pastForms, isFetching: pastIsFetching } = useGet<PartialForm[]>('/api/forms', 'pastForms', {});
  const { data: forms, isFetching } = useGet<PartialForm[]>('/api/forms', 'forms', {});

  const { remove: removePast } = useRemoveFromQuery(['forms', {}], handleDelete);
  const { remove } = useRemoveFromQuery(['forms', {}], handleDelete);

  return (
    <AdminLayout
      title='Manage Forms'
      header={
        <Box component='div' flexDirection='row' sx={{ display: 'flex' }} justifyContent='space-between'>
          <span>Manage Forms</span>
          <LoadingButton
            onClick={() => {
              setIsNavigating(true);
              router.push('/admin/forms/new');
            }}
            isLoading={isNavigating}
            startIcon={<AddIcon />}
            variant='contained'
            sx={{ width: '140px', height: '36.5px' }}
          >
            Add Form
          </LoadingButton>
        </Box>
      }
    >
      <Typography mb={3} color='secondary' variant='h2'>
        Forms
      </Typography>
      {forms?.length > 0 && <FormsTable forms={forms} isFetching={isFetching} onDelete={remove}></FormsTable>}
      {forms?.length <= 0 && (
        <Typography mb={3} variant='body1'>
          No forms found
        </Typography>
      )}
    </AdminLayout>
  );
};
export default ManageFormsPage;
