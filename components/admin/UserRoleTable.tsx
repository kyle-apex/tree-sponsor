import React, { useEffect, useState } from 'react';
import { Checkbox, LinearProgress, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Role } from '@prisma/client';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import axios from 'axios';
import { PartialUser } from 'interfaces';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';

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

const defaultHeadCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'User' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
];

function userHasRole(user: PartialUser, roleId: number) {
  if (!user?.roles) return false;
  return !!user.roles.find((role: Partial<Role>) => role.id === roleId);
}

async function handleRoleChange(userId: number, attributes: Record<string, unknown>) {
  await axios.post('/api/users/' + userId + '/toggleRole', attributes);
}

export default function UserRoleTable({
  roles,
  users,
  isFetching,
}: //refetch: refetchUsers,
{
  roles: Role[];
  users: PartialUser[];
  isFetching: boolean;
  //refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
}) {
  const classes = useStyles();
  const [headCells, setHeadCells] = useState(defaultHeadCells);

  const { updateById } = useUpdateQueryById('users', handleRoleChange);

  function toggleUserRole(user: PartialUser, role: Role, hasRole: boolean) {
    if (hasRole) user.roles.push(role);
    else {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i].id == role.id) user.roles.splice(i, 1);
      }
    }
    updateById(user.id, { roleName: role.name, hasRole: hasRole });
  }

  function getHeaderCells() {
    const newHeadCells = [...defaultHeadCells];
    for (const role of roles || []) {
      newHeadCells.push({ id: role.name, label: role.name, disablePadding: false, numeric: false });
    }
    setHeadCells(newHeadCells);
  }

  useEffect(() => {
    getHeaderCells();
  }, [roles]);

  return (
    <TableContainer className={classes.tableContainer}>
      {roles && (
        <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
          <TableHeader classes={classes} headCells={headCells} />
          {users && (
            <TableBody>
              {isFetching && (
                <TableRow>
                  <TableCell colSpan={6} className='compressed'>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {users.map(user => {
                return (
                  <StyledTableRow tabIndex={-1} key={user.id}>
                    <TableCell scope='row'>{user.name}</TableCell>
                    <TableCell scope='row'>{user.email}</TableCell>

                    {roles.map(role => {
                      return (
                        <TableCell key={role.name}>
                          <Checkbox
                            checked={userHasRole(user, role.id)}
                            onChange={event => {
                              toggleUserRole(user, role, event.target.checked);
                            }}
                          ></Checkbox>
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      )}
    </TableContainer>
  );
}
