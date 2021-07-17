import React, { useEffect, useState } from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { TableHeader } from 'components/TableHeader';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { useGet } from 'utils/hooks/use-get';
import { SubscriptionWithDetails } from '@prisma/client';
import Layout from 'components/layout/Layout';
import axios from 'axios';
import { TeeShirtSelect } from 'components/TeeShirtSelect';
import { stableSort, getComparator } from 'utils/material-ui/table-helpers';
import { StyledTableRow } from 'components/StyledTableRow';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 0,
  },
  tableContainer: {
    padding: theme.spacing(1),
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
  margin: {
    margin: theme.spacing(1),
  },
  white: {
    color: theme.palette.common.white + '!important',
  },
  full: {
    width: '100%',
  },
  search: {
    marginBottom: theme.spacing(2),
  },
}));

const headCells = [
  { id: 'userName', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'hasShirt', numeric: false, disablePadding: false, label: 'Has Shirt' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  /*{ id: 'startDate', numeric: true, disablePadding: false, label: 'Member Since' },*/
];

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc' as 'asc' | 'desc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [nameFilter, setNameFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { data: users, refetch } = useGet<SubscriptionWithDetails[]>('/api/members', 'members');

  const debounceMilliseconds = 1;

  const updateUser = async (userId: number, attributes: Record<string, unknown>) => {
    return await axios.post('/api/users/' + userId, { hasShirt: !!attributes.hasShirt });
  };

  const { updateById: updateHasShirt } = useUpdateQueryById('members', updateUser);

  useEffect(() => {
    const filterTimer = setTimeout(() => {
      if (!users) return;
      const filter = users.filter(state => {
        if (!state.userName) state.userName = state.email;

        return (
          state.userName.toLowerCase().includes(nameFilter.toLowerCase()) ||
          (state.email && state.email.toLowerCase().includes(nameFilter.toLowerCase()))
        );
      });

      setFilteredUsers(filter);
    }, debounceMilliseconds);

    return () => clearTimeout(filterTimer);
  }, [nameFilter, users]);

  const handleRequestSort = (_event: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <div className={classes.root}>
        <h1>Admin</h1>
        <TextField
          className={classes.full + ' ' + classes.search}
          id='input-with-icon-textfield'
          label='Find a Member'
          value={nameFilter}
          onChange={event => {
            setNameFilter(event.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TableContainer>
          <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
            <TableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredUsers.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(filteredUsers, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow tabIndex={-1} key={row.id}>
                      <TableCell id={labelId} scope='row'>
                        {row.userName}
                      </TableCell>
                      <TableCell>{row.status.toUpperCase().replace('_', ' ')}</TableCell>
                      <TableCell>
                        {row.amount >= 60 && (
                          <TeeShirtSelect updateHasShirt={updateHasShirt} hasShirt={row.hasShirt} userId={row.userId}></TeeShirtSelect>
                        )}
                      </TableCell>
                      <TableCell align='right'>${row.amount}</TableCell>
                      <TableCell>{row.email}</TableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component='div'
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </Layout>
  );
}
