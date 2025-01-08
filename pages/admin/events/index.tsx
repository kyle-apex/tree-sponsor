import { PartialEvent } from 'interfaces';
import AdminLayout from 'components/layout/AdminLayout';
import React, { useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import EventsTable from 'components/admin/EventsTable';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import LoadingButton from 'components/LoadingButton';
import Link from 'next/link';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasEventManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/events/' + id);
}

const ManageEventsPage = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: pastEvents, isFetching: pastIsFetching } = useGet<PartialEvent[]>('/api/events', 'pastEvents', { isPastEvent: true });
  const { data: events, isFetching } = useGet<PartialEvent[]>('/api/events', 'events', { isPastEvent: false });

  const { remove: removePast } = useRemoveFromQuery(['events', { isPastEvent: true }], handleDelete);
  const { remove } = useRemoveFromQuery(['events', { isPastEvent: false }], handleDelete);

  return (
    <AdminLayout
      title='Manage Events'
      header={
        <Box component='div' flexDirection='row' sx={{ display: 'flex' }} justifyContent='space-between'>
          <span>Manage Events</span>
          <LoadingButton
            onClick={() => {
              setIsNavigating(true);
              router.push('/admin/events/new');
            }}
            isLoading={isNavigating}
            startIcon={<AddIcon />}
            variant='contained'
            sx={{ width: '140px', height: '36.5px' }}
          >
            Add Event
          </LoadingButton>
        </Box>
      }
    >
      <Typography mb={3} color='secondary' variant='h2'>
        Upcoming Events
      </Typography>
      {events?.length > 0 && <EventsTable events={events} isFetching={isFetching} onDelete={remove}></EventsTable>}
      {events?.length <= 0 && (
        <Typography mb={3} variant='body1'>
          No upcoming events
        </Typography>
      )}
      <Typography mb={3} color='secondary' variant='h2'>
        Past Events
      </Typography>
      <EventsTable events={pastEvents} isPastEvent={true} isFetching={pastIsFetching} onDelete={removePast}></EventsTable>
    </AdminLayout>
  );
};
export default ManageEventsPage;
