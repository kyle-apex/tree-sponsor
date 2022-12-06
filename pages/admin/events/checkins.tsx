/*
I want to
- View checkins for an event
    - Display name/email/time
    - Allow removing
    - Allow combining to a different user if email mismatch?
    - Allow adding someone who didn't checkin themselves (maybe just a link to the event checkin?... or a user select box)
- View checkins for users
    - Table with name/email and columns for each event (most recent first)
    - Allow filtering by user name
    - Allow filtering by event
- View checkin for a user
    - Timeline of event checkins
- Ability to export all checkins to Excel
    - Name/Email/Event Name/Date
*/
/*
EventsPage:
- List of past events
    - Add a filter by name
    - Add a link to admin/eventcheckins
EventPage:
- Display checkins name/email/reason/isMember
CheckinsPage:
- 
*/

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
import Typography from '@mui/material/Typography';
import AttendeesTable from 'components/event/AttendeesTable';
import SearchBox from 'components/form/SearchBox';
import { useDebouncedCallback } from 'use-debounce';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasEventManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/events/delete-checkin?checkinId=' + id);
}
// TODO: Paginate
const CheckinsPage = () => {
  const router = useRouter();
  const [searchString, setSearchString] = useState('');
  const debouncedSetSearchText = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 300);

  const { data: attendees, isFetching } = useGet<PartialEvent[]>('/api/events/attendees', 'attendees', { searchString });

  const { remove } = useRemoveFromQuery('attendees', handleDelete);

  return (
    <AdminLayout title='Attendees' header='Attendees'>
      <SearchBox mb={2} label='Search Attendees' onChange={debouncedSetSearchText} defaultValue={searchString}></SearchBox>

      <AttendeesTable attendees={attendees} isFetching={isFetching} onDelete={remove}></AttendeesTable>
    </AdminLayout>
  );
};
export default CheckinsPage;
