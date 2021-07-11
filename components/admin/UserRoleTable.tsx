import React, { useEffect, useState } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Role } from '@prisma/client';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import axios from 'axios';
import { QueryObserverResult, RefetchOptions } from 'react-query';
import { PartialUser } from 'interfaces';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
}));

const defaultHeadCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'User' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
];

function userHasRole(user: PartialUser, roleId: number) {
  return !!user.roles.find((role: Partial<Role>) => role.id === roleId);
}

export default function UserRoleTable({
  roles,
  users,
  refetch: refetchUsers,
}: {
  roles: Role[];
  users: PartialUser[];
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
}) {
  const classes = useStyles();
  const [headCells, setHeadCells] = useState(defaultHeadCells);

  async function handleRoleChange(userId: number, roleName: string, hasRole: boolean) {
    await axios.post('/api/users/' + userId + '/toggleRole', { roleName: roleName, hasRole: hasRole });
    refetchUsers();
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
                              handleRoleChange(user.id, role.name, event.target.checked);
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
