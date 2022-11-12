import { PartialEvent } from 'interfaces';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import AdminLayout from 'components/layout/AdminLayout';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import React, { useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import EventsTable from 'components/admin/EventsTable';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasEventManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/events/' + id);
}

const ManageEventsPage = () => {
  const router = useRouter();

  const { data: events, isFetching } = useGet<PartialEvent[]>('/api/events', 'events');
  const { remove } = useRemoveFromQuery('events', handleDelete);

  return (
    <AdminLayout
      title='Manage Events'
      header={
        <Box component='div' flexDirection='row' sx={{ display: 'flex' }} justifyContent='space-between'>
          <span>Manage Events</span>
          <Button
            onClick={() => {
              router.push('/admin/events/new');
            }}
            startIcon={<AddIcon />}
            variant='contained'
            sx={{ width: '140px' }}
          >
            Add Event
          </Button>
        </Box>
      }
    >
      <EventsTable events={events} isFetching={isFetching} onDelete={remove}></EventsTable>
    </AdminLayout>
  );
};
export default ManageEventsPage;
