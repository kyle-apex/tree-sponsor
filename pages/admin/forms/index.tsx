import { PartialForm } from 'interfaces';
import AdminLayout from 'components/layout/AdminLayout';
import React, { useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import LoadingButton from 'components/LoadingButton';
import FormsTable from 'components/admin/FormsTable';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasFormManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/forms/' + id);
}

const ManageFormsPage = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const [showDeleted, setShowDeleted] = useState(false);

  const {
    data: forms,
    isFetching,
    refetch,
  } = useGet<PartialForm[]>('/api/forms', ['forms', { includeDeleted: showDeleted }], {
    includeDeleted: showDeleted,
  });

  const { remove } = useRemoveFromQuery(['forms', { includeDeleted: showDeleted }], handleDelete, true);

  async function handleRestore(id: number) {
    await axios.put(`/api/forms/${id}/restore`);
    refetch();
  }

  const handleToggleShowDeleted = (newValue: boolean) => {
    setShowDeleted(newValue);
  };

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
            sx={{ width: '140px', height: 'fit-content' }}
          >
            Add Form
          </LoadingButton>
        </Box>
      }
    >
      <Typography mb={3} color='secondary' variant='h2'>
        Forms
      </Typography>
      {forms?.length > 0 && (
        <FormsTable
          forms={forms}
          isFetching={isFetching}
          onDelete={remove}
          onRestore={handleRestore}
          onToggleShowDeleted={handleToggleShowDeleted}
          showDeleted={showDeleted}
        />
      )}
      {forms?.length <= 0 && (
        <Typography mb={3} variant='body1'>
          No forms found
        </Typography>
      )}
    </AdminLayout>
  );
};
export default ManageFormsPage;
