import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import makeStyles from '@mui/styles/makeStyles';
import parsedGet from 'utils/api/parsed-get';
import StatisticIconDisplay from './StatisticIconDisplay';
import { StyledTableRow } from 'components/StyledTableRow';
import { TableHeader } from 'components/TableHeader';
import { Prisma } from '@prisma/client';
import type { EventStats } from 'interfaces';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  white: {
    color: theme.palette.common.white,
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
}));

const headerCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Event Name' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'checkInCount', numeric: true, disablePadding: false, label: 'Event Check-ins' },
  { id: 'goingRsvpCount', numeric: true, disablePadding: false, label: 'RSVPs (Going)' },
  { id: 'maybeRsvpCount', numeric: true, disablePadding: false, label: 'RSVPs (Maybe)' },
  { id: 'rsvpCheckInCount', numeric: true, disablePadding: false, label: `RSVPs who Checked-in` },
  { id: 'firstTimeCheckInCount', numeric: true, disablePadding: false, label: 'First Timers' },
  { id: 'newMemberCount', numeric: true, disablePadding: false, label: 'New Members' },
  { id: 'fundraisingAmount', numeric: true, disablePadding: false, label: 'Pre-Event Fundraising' },
];

const EventAttendanceStats = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<string>('startDate');

  const getStats = async () => {
    setIsLoading(true);
    const data = await parsedGet<EventStats[]>('/api/events/attendance-stats');
    setStats(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    getStats();
  }, []);

  // Handle sort request
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Function to sort data
  const sortedStats = React.useMemo(() => {
    if (!stats.length) return [];

    return [...stats].sort((a, b) => {
      // Special handling for different columns
      if (orderBy === 'startDate') {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
        return order === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (orderBy === 'name') {
        const aName = a.name || '';
        const bName = b.name || '';
        return order === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }

      // For numeric columns
      const numericColumns = [
        'checkInCount',
        'goingRsvpCount',
        'maybeRsvpCount',
        'rsvpCheckInCount',
        'firstTimeCheckInCount',
        'newMemberCount',
      ];

      if (numericColumns.includes(orderBy)) {
        const aNum = (a[orderBy as keyof EventStats] as number) || 0;
        const bNum = (b[orderBy as keyof EventStats] as number) || 0;
        return order === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // For fundraising columns
      if (orderBy === 'fundraisingGoal' || orderBy === 'fundraisingAmount') {
        const aAmount = a[orderBy as keyof EventStats] ? Number(a[orderBy as keyof EventStats]) : 0;
        const bAmount = b[orderBy as keyof EventStats] ? Number(b[orderBy as keyof EventStats]) : 0;
        return order === 'asc' ? aAmount - bAmount : bAmount - aAmount;
      }

      // Default case
      return 0;
    });
  }, [stats, order, orderBy]);

  // Calculate summary statistics
  const totalCheckIns = stats.reduce((sum, event) => sum + event.checkInCount, 0);
  const totalRsvpsGoing = stats.reduce((sum, event) => sum + event.goingRsvpCount, 0);
  const totalRsvpsMaybe = stats.reduce((sum, event) => sum + event.maybeRsvpCount, 0);
  const totalFirstTimeCheckIns = stats.reduce((sum, event) => sum + event.firstTimeCheckInCount, 0);
  const totalNewMembers = stats.reduce((sum, event) => sum + event.newMemberCount, 0);

  // Calculate overall check-in rate
  const totalRelevantRsvps = totalRsvpsGoing + totalRsvpsMaybe;
  const overallCheckInRate = totalRelevantRsvps > 0 ? Math.round((totalCheckIns / totalRelevantRsvps) * 100) : 0;

  // Format date function
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency function
  const formatCurrency = (amount: number | Prisma.Decimal | null) => {
    if (amount === null) return 'N/A';
    return `$${Number(amount).toFixed(2)}`;
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label='event attendance table' size='medium'>
          <TableHeader
            classes={{
              white: classes.white,
              visuallyHidden: classes.visuallyHidden,
            }}
            headCells={headerCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : (
              sortedStats.map(event => (
                <StyledTableRow key={event.id}>
                  <TableCell component='th' scope='row'>
                    {event.name}
                  </TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell align='right'>{event.checkInCount}</TableCell>
                  <TableCell align='right'>{event.goingRsvpCount}</TableCell>
                  <TableCell align='right'>{event.maybeRsvpCount}</TableCell>
                  <TableCell align='right'>{event.rsvpCheckInCount}</TableCell>
                  <TableCell align='right'>{event.firstTimeCheckInCount}</TableCell>
                  <TableCell align='right'>{event.newMemberCount}</TableCell>
                  <TableCell align='right'>
                    {event.fundraisingGoal ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Box sx={{ width: '100%', mb: 1 }}>
                          <Typography variant='body2'>
                            {formatCurrency(event.fundraisingAmount)} of {formatCurrency(event.fundraisingGoal)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant='determinate'
                          value={
                            event.fundraisingGoal && event.fundraisingAmount
                              ? Math.min(100, (Number(event.fundraisingAmount) / Number(event.fundraisingGoal)) * 100)
                              : 0
                          }
                          sx={{ width: '100%' }}
                          className={classes.progressBar}
                        />
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            )}
            {!isLoading && stats.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align='center'>
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EventAttendanceStats;
