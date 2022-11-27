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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import LaunchIcon from '@mui/icons-material/Launch';

import { PartialEvent } from 'interfaces';
import { Router } from '@mui/icons-material';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

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
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'path', numeric: false, disablePadding: false, label: 'Path' },
  { id: 'edit', numeric: false, disablePadding: false },
];

export default function EventsTable({
  events,
  isFetching,
  onDelete,
  isPastEvent,
}: {
  events: PartialEvent[];
  isFetching: boolean;
  onDelete?: (eventId: number) => void;
  isPastEvent?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const classes = useStyles();

  const router = useRouter();

  const edit = (path: string) => {
    if (!path) return;
    router.push(`/admin/events/${path}`);
  };
  const preview = (path: string) => {
    //router.push(`/e/${path}/checkin`);
    if (!path) return;
    window.open(`/e/${path}/checkin`);
  };

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
          <TableHeader classes={classes} headCells={headerCells} />
          {events && (
            <TableBody>
              {isFetching && (
                <TableRow>
                  <TableCell colSpan={6} className='compressed'>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {events.map((event: PartialEvent) => {
                return (
                  <StyledTableRow tabIndex={-1} key={event.id}>
                    <TableCell scope='row'>{event.name}</TableCell>
                    <TableCell scope='row'>{event.startDate?.toLocaleDateString() + ' ' + event.startDate?.toLocaleTimeString()}</TableCell>
                    <TableCell scope='row'>{event.location?.name}</TableCell>
                    <TableCell scope='row'>{event.path}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          edit(event.path);
                        }}
                        size='large'
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          preview(event.path);
                        }}
                        size='large'
                      >
                        <LaunchIcon></LaunchIcon>
                      </IconButton>
                      {!isPastEvent && (
                        <>
                          <IconButton
                            onClick={() => {
                              setCurrentId(event.id);
                              setIsConfirmOpen(true);
                            }}
                            size='large'
                          >
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        itemType='event'
        title='Remove Event'
        onConfirm={() => onDelete(currentId)}
      ></DeleteConfirmationDialog>
    </>
  );
}
