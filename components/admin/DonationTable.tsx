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
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
}));

const headerCells = [
  { id: 'label', numeric: false, disablePadding: false, label: 'Label' },
  { id: 'source', numeric: false, disablePadding: false, label: 'Source' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'delete', numeric: false, disablePadding: false },
];
/*
async function handleRoleChange(userId: number, attributes: Record<string, unknown>) {
  await axios.patch('/api/users/' + userId + '/toggleRole', attributes);
}*/

export default function DonationsTable({
  donations,
  isFetching,
  onDelete,
}: {
  donations: Donation[];
  isFetching: boolean;
  onDelete: (donationId: number) => void;
}) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tableContainer}>
      <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
        <TableHeader classes={classes} headCells={headerCells} />
        {donations && (
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={6} className='compressed'>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
            {donations.map((donation: Donation) => {
              return (
                <StyledTableRow tabIndex={-1} key={donation.id + donation.label}>
                  <TableCell scope='row'>{donation.label}</TableCell>
                  <TableCell scope='row'>{donation.source}</TableCell>
                  <TableCell scope='row'>{donation.date?.toLocaleDateString()}</TableCell>
                  <TableCell align='right'>${donation?.amount?.toNumber()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        onDelete(donation.id);
                      }}
                      size='large'
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
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
