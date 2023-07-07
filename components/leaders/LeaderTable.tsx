import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import { Donation } from '@prisma/client';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import IconButton from '@mui/material/IconButton';
import { LeaderRow, PartialUser } from 'interfaces';
import Attendee from 'components/event/Attendee';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
}));

/*
async function handleRoleChange(userId: number, attributes: Record<string, unknown>) {
  await axios.patch('/api/users/' + userId + '/toggleRole', attributes);
}*/

export default function LeaderTable({
  leaders,
  title,
  unit,
  isFetching,
}: {
  leaders: LeaderRow[];
  title?: string;
  unit?: string;
  isFetching?: boolean;
}) {
  const classes = useStyles();

  const headerCells = [
    { id: 'position', numeric: false, disablePadding: true, label: '', sx: { width: '32px' } },
    { id: 'user', numeric: false, disablePadding: false, label: title || 'Top Tree Identifiers' },
    {
      id: 'count',
      numeric: true,
      disablePadding: false,
      label: unit || 'Trees',
      sx: { width: '64px', textAlign: 'right', paddingLeft: 0 },
    },
  ];

  return (
    <TableContainer className={classes.tableContainer}>
      <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
        <TableHeader classes={classes} headCells={headerCells} />
        {leaders && (
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={6} className='compressed'>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
            {leaders.map((row: LeaderRow, idx: number) => {
              return (
                <StyledTableRow tabIndex={-1} key={row?.position}>
                  <TableCell scope='row' sx={{ pr: 0, pl: 1 }}>
                    {(idx == 0 || leaders[idx - 1].position != row.position) && <span>{row.position}.</span>}
                  </TableCell>
                  <TableCell scope='row' sx={{ pl: 0, pr: 0 }}>
                    <Attendee hideContactPageIcon={true} user={row.user}></Attendee>
                  </TableCell>
                  <TableCell scope='row' sx={{ textAlign: 'right', pl: 0 }}>
                    {row.count}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
