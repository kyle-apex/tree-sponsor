import React, { useEffect, useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
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
import Link from 'next/link';
import SearchBox from 'components/form/SearchBox';
import Box from '@mui/material/Box';
import restrictPageAccess from 'utils/auth/restrict-page-access';
import { GetSessionOptions } from 'next-auth/client';
import RestrictSection from 'components/RestrictSection';
import { capitalCase } from 'change-case';
import usePagination from 'utils/hooks/use-pagination';
import UserSelector from 'components/UserSelector';
import NavigationMenu from 'components/admin/NavigationMenu';
import SplitRow from 'components/layout/SplitRow';
import { Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const getServerSideProps = (ctx: GetSessionOptions) => {
  return restrictPageAccess(ctx, 'isAdmin');
};

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
  /*{ id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },*/
  { id: 'lastPaymentDate', numeric: false, disablePadding: false, label: 'Last Donation' },
  { id: 'createdDate', numeric: false, disablePadding: false, label: 'Member Since' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'referralUserId', numeric: false, disablePadding: false, label: 'Referred By' },
];

export default function EnhancedTable(): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [order, setOrder] = useState('asc' as 'asc' | 'desc');
  const [orderBy, setOrderBy] = useState('createdDate');
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination(100);

  const [nameFilter, setNameFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { data: users, isFetching } = useGet<SubscriptionWithDetails[]>('/api/members', 'members');

  for (const row of users || []) {
    row.status = row.statusDetails ? capitalCase(row.statusDetails) : row.status ? capitalCase(row.status) : '';
  }

  const debounceMilliseconds = 1;

  const updateUser = async (userId: number, attributes: Record<string, unknown>) => {
    const newAttributes =
      attributes.referralUserId !== undefined ? { referralUserId: attributes.referralUserId } : { hasShirt: !!attributes.hasShirt };
    await axios.patch('/api/users/' + userId, newAttributes);
  };

  const { updateById: updateHasShirt } = useUpdateQueryById('members', updateUser);
  const { updateById: updateReferralUserId } = useUpdateQueryById('members', updateUser);

  useEffect(() => {
    const filterTimer = setTimeout(() => {
      if (!users) return;
      const filter = users.filter(state => {
        if (!state.userName) state.userName = state.email;

        return (
          state.userName.toLowerCase().includes(nameFilter?.toLowerCase()) ||
          (state.email && state.email.replace('.com', '').toLowerCase().includes(nameFilter?.toLowerCase())) ||
          state.email?.toLowerCase().includes(nameFilter?.toLowerCase()) ||
          state.email2?.toLowerCase().includes(nameFilter?.toLowerCase())
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

  // Function to convert data to CSV format
  const convertToCSV = useCallback((data: SubscriptionWithDetails[]) => {
    if (!data || data.length === 0) return '';

    // Extract column headers from headCells
    const headers = headCells.map(cell => cell.label);

    // Create CSV header row
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    data.forEach((row: SubscriptionWithDetails) => {
      const createdDate = new Date(row.createdDate);
      const lastPaymentDate = new Date(row.lastPaymentDate || row.createdDate);

      // Map row data to match headers order
      const rowData = [
        // Name
        row.userName ? `"${row.userName.replace(/"/g, '""')}"` : '',
        // Status
        row.status ? `"${row.status.replace(/"/g, '""')}"` : '',
        // Has Shirt
        row.hasShirt ? 'Yes' : 'No',
        // Last Donation
        lastPaymentDate.toLocaleDateString(),
        // Member Since
        createdDate.toLocaleDateString(),
        // Email
        row.email ? `"${row.email.replace(/"/g, '""')}"` : '',
        // Referred By (we don't have the name here, just the ID)
        row.referralUserId || '',
      ];

      csvContent += rowData.join(',') + '\n';
    });

    return csvContent;
  }, []);

  // Function to export data to CSV
  const exportToCSV = useCallback(() => {
    // Get the sorted and filtered data
    const dataToExport = stableSort(filteredUsers, getComparator(order, orderBy));

    // Convert to CSV
    const csvContent = convertToCSV(dataToExport);

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'members.csv');

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredUsers, order, orderBy, convertToCSV]);

  return (
    <Layout title='Admin'>
      <div className={classes.root}>
        <SplitRow>
          <h1>Admin</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <RestrictSection accessType='hasAuthManagement'>
              <Button
                variant='contained'
                color='primary'
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto', pr: isMobile ? '4px' : 2 }}
                size='medium'
                startIcon={<DownloadIcon />}
                onClick={exportToCSV}
              >
                {!isMobile && 'Export to CSV'}
              </Button>
            </RestrictSection>
            <NavigationMenu></NavigationMenu>
          </div>
        </SplitRow>
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
                  const createdDate = new Date(row.createdDate);
                  const lastPaymentDate = new Date(row.lastPaymentDate || row.createdDate);
                  const isPaymentLate = new Date().getTime() - lastPaymentDate.getTime() > 366 * 24 * 60 * 60 * 1000;

                  return (
                    <StyledTableRow tabIndex={-1} key={row.id}>
                      <TableCell id={labelId} scope='row'>
                        {row.userName}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme => {
                            return isPaymentLate ? theme.palette.error.main : 'inherit';
                          },
                        }}
                      >
                        <div>{row.status}</div>
                        {row.cancellationDetails && <Typography variant='caption'>{capitalCase(row.cancellationDetails)}</Typography>}
                      </TableCell>
                      <TableCell className={classes.condensedCell}>
                        {row.amount >= 60 && (
                          <TeeShirtSelect updateHasShirt={updateHasShirt} hasShirt={row.hasShirt} userId={row.userId}></TeeShirtSelect>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme => {
                            return isPaymentLate ? theme.palette.error.main : 'inherit';
                          },
                        }}
                      >
                        {lastPaymentDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{createdDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {row.email}
                        {row.email2 && <div>{row.email2}</div>}
                      </TableCell>
                      <TableCell sx={{ minWidth: '200px' }}>
                        <UserSelector
                          defaultValue={row.referralUserId}
                          resetOnSelect={false}
                          isEmailHidden={true}
                          onChange={(referralUserId: number) => {
                            updateReferralUserId(row.userId, { referralUserId });
                          }}
                          label='Referred By'
                          autoWidth={true}
                        ></UserSelector>
                      </TableCell>
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
