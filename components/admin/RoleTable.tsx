import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import makeStyles from '@mui/styles/makeStyles';
import { Role } from '@prisma/client';
import { HeaderCellOptions, TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import axios from 'axios';
import { QueryObserverResult, RefetchOptions } from 'react-query';
import { useRemoveFromQuery } from 'utils/hooks/use-remove-from-query';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
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
  container: {
    marginBottom: theme.spacing(3),
  },
}));

const headCells: HeaderCellOptions[] = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'isAdmin', numeric: false, disablePadding: false, label: 'Is Admin?' },
  { id: 'hasAuthManagement', numeric: false, disablePadding: false, label: 'Can Manage Authentication?' },
  { id: 'delete', numeric: false, disablePadding: false },
];

export default function RoleTable({
  roles,
  refetch,
  isFetching,
}: {
  roles: Role[];
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  isFetching: boolean;
}) {
  const classes = useStyles();
  const { remove } = useRemoveFromQuery('roles', handleDelete);

  async function handleAcessTypeChange(roleId: number, accessType: string, value: boolean) {
    await axios.post('/api/roles/' + roleId, { [accessType]: value });
    refetch();
  }

  async function handleDelete(roleId: number) {
    await axios.delete('/api/roles/' + roleId);
  }

  return (
    <TableContainer className={classes.container}>
      <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
        <TableHeader classes={classes} headCells={headCells} />
        {roles && (
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={6} className='compressed'>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
            {roles.map(row => {
              return (
                <StyledTableRow tabIndex={-1} key={row.id}>
                  <TableCell scope='row'>{row.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.isAdmin}
                      onChange={event => {
                        handleAcessTypeChange(row.id, 'isAdmin', event.target.checked);
                      }}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.hasAuthManagement}
                      onChange={event => {
                        handleAcessTypeChange(row.id, 'hasAuthManagement', event.target.checked);
                      }}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        remove(row.id);
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
