import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetServerSidePropsContext } from 'next';
import AdminLayout from 'components/layout/AdminLayout';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { useGet } from 'utils/hooks/use-get';
import { PartialEvent } from 'interfaces';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import makeStyles from '@mui/styles/makeStyles';

// Define the analytics data interface based on the API response
interface UserAnalytics {
  userId: number;
  userName: string | null;
  userImage: string | null;
  uniquePageViews: number;
  totalRSVPs: number;
  rsvpsByStatus: {
    going: number;
    maybe: number;
    declined: number;
    invited: number;
  };
}

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  white: {
    color: theme.palette.common.white + '!important',
  },
  formControl: {
    minWidth: 300,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
}));

const headerCells = [
  { id: 'userName', numeric: false, disablePadding: false, label: 'User Name' },
  { id: 'uniquePageViews', numeric: true, disablePadding: false, label: 'Unique Page Views' },
  { id: 'totalRSVPs', numeric: true, disablePadding: false, label: 'Total RSVPs' },
  { id: 'going', numeric: true, disablePadding: false, label: 'Going' },
  { id: 'maybe', numeric: true, disablePadding: false, label: 'Maybe' },
  { id: 'declined', numeric: true, disablePadding: false, label: 'Declined' },
];

const RSVPAnalyticsPage = () => {
  const classes = useStyles();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Fetch only events with RSVPs
  const { data: events, isFetching: isLoadingEvents } = useGet<PartialEvent[]>('/api/events/with-rsvps', 'eventsWithRsvps');

  // Fetch analytics data for the selected event only when we have a valid eventId
  const { data: analyticsData, isFetching: isLoadingAnalytics } = useGet<UserAnalytics[]>(
    `/api/events/rsvp-analytics?eventId=${selectedEventId}`,
    ['rsvpAnalytics', selectedEventId?.toString()],
    {},
    {
      refetchOnWindowFocus: false,
      /*enabled: !!selectedEventId,*/ // Only run the query when selectedEventId exists
    },
  );

  // Select the most recent/future event by default
  useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      try {
        // Sort events by date (most recent first)
        const sortedEvents = [...events].sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        });

        // Find the first future event or use the most recent one
        const now = new Date();
        const futureEvent = sortedEvents.find(event => {
          return event.startDate && new Date(event.startDate) > now;
        });

        // Set the selected event ID
        const eventToSelect = futureEvent?.id || sortedEvents[0]?.id || null;
        if (eventToSelect) {
          setSelectedEventId(eventToSelect);
        }
      } catch (error) {
        console.error('Error selecting default event:', error);
        // If there's an error, just select the first event
        if (events[0]?.id) {
          setSelectedEventId(events[0].id);
        }
      }
    }
  }, [events, selectedEventId]);

  const handleEventChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedEventId(value ? Number(value) : null);
  };

  return (
    <AdminLayout title='RSVP Analytics' header='RSVP Analytics'>
      <FormControl className={classes.formControl}>
        <Select
          labelId='event-select-label'
          id='event-select'
          value={selectedEventId || ''}
          onChange={handleEventChange}
          disabled={isLoadingEvents}
          sx={{ mt: -2 }}
        >
          {isLoadingEvents ? (
            <MenuItem value=''>
              <em>Loading events...</em>
            </MenuItem>
          ) : (
            events?.map(event => (
              <MenuItem key={event.id} value={event.id}>
                {event.name} {event.startDate ? `(${new Date(event.startDate).toLocaleDateString()})` : ''}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {!selectedEventId ? (
        <Alert severity='info'>Please select an event to view analytics data.</Alert>
      ) : isLoadingAnalytics ? (
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : analyticsData && analyticsData.length > 0 ? (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label='RSVP analytics table'>
            <TableHeader classes={classes} headCells={headerCells} />
            <TableBody>
              {analyticsData.map(row => (
                <StyledTableRow key={row.userId}>
                  <TableCell component='th' scope='row'>
                    {row.userName || `User ID: ${row.userId}`}
                  </TableCell>
                  <TableCell align='right'>{row.uniquePageViews}</TableCell>
                  <TableCell align='right'>{row.totalRSVPs}</TableCell>
                  <TableCell align='right'>{row.rsvpsByStatus.going}</TableCell>
                  <TableCell align='right'>{row.rsvpsByStatus.maybe}</TableCell>
                  <TableCell align='right'>{row.rsvpsByStatus.declined}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity='info'>No RSVP analytics data available for this event.</Alert>
      )}
    </AdminLayout>
  );
};

export default RSVPAnalyticsPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Restrict access to users with event management permissions
  return restrictPageAccess(ctx, 'hasEventManagement');
};
