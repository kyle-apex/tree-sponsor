import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { useGet } from 'utils/hooks/use-get';
import { SubscriptionWithDetails } from '@prisma/client';
import Layout from 'components/layout/Layout';
import axios from 'axios';
import { TeeShirtSelect } from 'components/TeeShirtSelect';

function descendingComparator(a: any, b: any, orderBy: string) {
  const aValue = typeof b[orderBy] === 'string' ? b[orderBy].toLowerCase() : b[orderBy];
  const bValue = typeof a[orderBy] === 'string' ? a[orderBy].toLowerCase() : a[orderBy];

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

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
  { id: 'shirtSize', numeric: false, disablePadding: false, label: 'Shirt' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  /*{ id: 'startDate', numeric: true, disablePadding: false, label: 'Member Since' },*/
];

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function EnhancedTableHead(props: any) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };
  //const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              classes={{ active: classes.white, icon: classes.white }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const [nameFilter, setNameFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { data: users, refetch } = useGet<SubscriptionWithDetails[]>('/api/members', 'members');

  const debounceMilliseconds = 1;

  useEffect(() => {
    const timer = setTimeout(() => {
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

    return () => clearTimeout(timer);
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

  const setShirtSize = async (row: SubscriptionWithDetails, size: string) => {
    console.log('set size', row, size);
    const result = await axios.post('/api/users/' + row.userId, { shirtSize: size });
    refetch();
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
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredUsers.length}
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
                        <TeeShirtSelect size={row.shirtSize} userId={row.userId}></TeeShirtSelect>
                      </TableCell>
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
