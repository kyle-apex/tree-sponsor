import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';

import { PartialAttendee, PartialEvent } from 'interfaces';
import { Router } from '@mui/icons-material';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import AttendeeTableRow from './AttendeeTableRow';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
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
}));

const headerCells = [
  { id: 'eventName', numeric: false, disablePadding: false, label: 'Event' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'isMember', numeric: false, disablePadding: false, label: 'Member?' },
  { id: 'createdDate', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'discoveredFrom', numeric: false, disablePadding: false, label: 'Discovered From' },
  { id: 'edit', numeric: false, disablePadding: false },
];

export default function AttendeesTable({
  attendees,
  isFetching,
  onDelete,
  onUpdate,
}: {
  attendees: PartialAttendee[];
  isFetching: boolean;
  onDelete?: (eventId: number) => void;
  onUpdate?: (id: number, updates: PartialAttendee) => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const classes = useStyles();

  const router = useRouter();

  const edit = (path: string) => {
    if (!path) return;
    router.push(`/admin/events/${path}`);
  };

  const handleDeleteClick = (id: number) => {
    setCurrentId(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
          <TableHeader classes={classes} headCells={headerCells} />
          {attendees && (
            <TableBody>
              {isFetching && (
                <TableRow>
                  <TableCell colSpan={6} className='compressed'>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {attendees.map((attendee: PartialAttendee) => {
                return <AttendeeTableRow key={attendee.checkinId} attendee={attendee} onDelete={handleDeleteClick} onUpdate={onUpdate} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        itemType='attendee'
        title='Remove Checkin'
        onConfirm={() => onDelete(currentId)}
      ></DeleteConfirmationDialog>
    </>
  );
}
