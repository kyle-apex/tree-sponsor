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

import { PartialAttendee, PartialEvent } from 'interfaces';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import AdminLayout from 'components/layout/AdminLayout';
import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import React, { useState } from 'react';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import EventsTable from 'components/admin/EventsTable';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import AttendeesTable from 'components/event/AttendeesTable';
import SearchBox from 'components/form/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import { useUpdateQueryById } from 'utils/hooks';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'hasEventManagement');
};

async function handleDelete(id: number) {
  await axios.delete('/api/events/delete-checkin?checkinId=' + id);
}
async function handleUpdate(id: number, attributes: Record<string, unknown>) {
  await axios.patch('/api/users/' + id, attributes);
}

// Function to export attendees data to Excel (CSV format)
function exportToExcel(attendees: PartialAttendee[]) {
  if (!attendees || attendees.length === 0) return;

  // Define the headers for the CSV file
  const headers = ['Event', 'Name', 'Email', 'Member?', 'Date', 'Discovered From'];

  // Convert attendees data to CSV rows
  const csvRows = attendees.map(attendee => {
    const isMember = attendee.isMember == 1 ? 'Yes' : 'No';
    const date = attendee.createdDate ? new Date(attendee.createdDate).toLocaleDateString() : '';

    return [attendee.eventName || '', attendee.name || '', attendee.email || '', isMember, date, attendee.discoveredFrom || '']
      .map(value => `"${value.toString().replace(/"/g, '""')}"`)
      .join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'attendees.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// TODO: Paginate
const CheckinsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchString, setSearchString] = useState('');
  const debouncedSetSearchText = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 300);

  const { data: attendees, isFetching, refetch } = useGet<PartialAttendee[]>('/api/events/attendees', 'attendees', { searchString });

  const { remove } = useRemoveFromQuery(['attendees', { searchString }], handleDelete, true);

  const { updateById } = useUpdateQueryById(['attendees', { searchString }], handleUpdate, true);

  return (
    <AdminLayout title='Attendees' header='Attendees'>
      <Box display='flex' justifyContent='space-between' gap={1} alignItems='center' mb={2}>
        <SearchBox label='Search Attendees' onChange={debouncedSetSearchText} defaultValue={searchString}></SearchBox>
        <Button
          variant='contained'
          color='primary'
          size='medium'
          startIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(attendees)}
          disabled={!attendees || attendees.length === 0}
          sx={{ whiteSpace: 'nowrap', minWidth: 'auto', pr: isMobile ? '4px' : 2 }}
        >
          {!isMobile && 'Export to CSV'}
        </Button>
      </Box>

      <AttendeesTable attendees={attendees} isFetching={isFetching} onDelete={remove} onUpdate={updateById}></AttendeesTable>
    </AdminLayout>
  );
};
export default CheckinsPage;
