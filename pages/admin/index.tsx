import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { TableHeader } from 'components/TableHeader';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import { useGet } from 'utils/hooks/use-get';
import { SubscriptionWithDetails } from '@prisma/client';
import Layout from 'components/layout/Layout';
import axios from 'axios';
import { TeeShirtSelect } from 'components/TeeShirtSelect';
import { stableSort, getComparator } from 'utils/material-ui/table-helpers';
import { StyledTableRow } from 'components/StyledTableRow';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import serverSideIsAdmin from 'utils/auth/server-side-is-admin';
import Link from 'next/link';
import SearchBox from 'components/form/SearchBox';
import Box from '@mui/material/Box';

export const getServerSideProps = serverSideIsAdmin;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  condensedCell: {
    padding: '0px 6px',
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
  { id: 'createdDate', numeric: false, disablePadding: false, label: 'Member Since' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
];

export default function EnhancedTable(): JSX.Element {
  const classes = useStyles();
  const [order, setOrder] = useState('asc' as 'asc' | 'desc');
  const [orderBy, setOrderBy] = useState('createdDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [nameFilter, setNameFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { data: users, isFetching } = useGet<SubscriptionWithDetails[]>('/api/members', 'members');

  const debounceMilliseconds = 1;

  const updateUser = async (userId: number, attributes: Record<string, unknown>) => {
    await axios.patch('/api/users/' + userId, { hasShirt: !!attributes.hasShirt });
  };

  const { updateById: updateHasShirt } = useUpdateQueryById('members', updateUser);

  useEffect(() => {
    const filterTimer = setTimeout(() => {
      if (!users) return;
      const filter = users.filter(state => {
        if (!state.userName) state.userName = state.email;

        return (
          state.userName.toLowerCase().includes(nameFilter.toLowerCase()) ||
          (state.email && state.email.replace('.com', '').toLowerCase().includes(nameFilter.toLowerCase()))
        );
      });

      setFilteredUsers(filter);
    }, debounceMilliseconds);

    return () => clearTimeout(filterTimer);
  }, [nameFilter, users]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout title='Admin'>
      <div className={classes.root}>
        <Box sx={{ flexDirection: 'row', display: 'flex' }} gap={2}>
          <Link href='/admin/roles'>
            <Button variant='outlined'>Manage Roles</Button>
          </Link>
          <Link href='/admin/review/sponsorships'>
            <Button variant='outlined'>Review Thank-a-Trees</Button>
          </Link>
          <Link href='/admin/review/trees'>
            <Button variant='outlined'>Review Tree Ids</Button>
          </Link>
        </Box>

        <h1>Admin</h1>
        <SearchBox label='Find a Member' onChange={setNameFilter} defaultValue={nameFilter}></SearchBox>

        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component='div'
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
              {isFetching && (
                <TableRow>
                  <TableCell colSpan={6} className='compressed'>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
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
                      <TableCell className={classes.condensedCell}>
                        {row.amount >= 60 && (
                          <TeeShirtSelect updateHasShirt={updateHasShirt} hasShirt={row.hasShirt} userId={row.userId}></TeeShirtSelect>
                        )}
                      </TableCell>
                      <TableCell align='right'>${row.amount}</TableCell>
                      <TableCell>{new Date(row.createdDate).toLocaleDateString()}</TableCell>
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Layout>
  );
}
