import React, { useEffect } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Role } from '@prisma/client';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import { useGet } from 'utils/hooks/use-get';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 0,
  },
}));

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'User' },
  { id: 'isAdmin', numeric: false, disablePadding: false, label: 'Is Admin?' },
  { id: 'hasAuthManagement', numeric: false, disablePadding: false, label: 'Can Manage Authentication?' },
];

export default function UserRoleTable(props: { roles: Role[] }) {
  const classes = useStyles();
  const { data: roles, refetch: refetchRoles } = useGet<Role[]>('/api/roles', 'roles');
  //const roles: Role[] = [{ id: 1, name: 'Why', hasAuthManagement: true, isAdmin: false }];
  async function handleAcessTypeChange(roleId: number, accessType: string, value: boolean) {
    await axios.post('/api/roles/' + roleId, { [accessType]: value });
    refetchRoles();
  }

  useEffect(() => {
    return;
  }, [props.roles]);

  return (
    <div>
      <TableContainer>
        <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
          <TableHeader classes={classes} headCells={headCells} />
          {roles && (
            <TableBody>
              {roles.map(row => {
                return (
                  <StyledTableRow tabIndex={-1} key={row.id}>
                    <TableCell scope='row'>{row.name}</TableCell>
                    <TableCell align='right'>
                      <Checkbox
                        checked={row.isAdmin}
                        onChange={event => {
                          handleAcessTypeChange(row.id, 'isAdmin', event.target.checked);
                        }}
                      ></Checkbox>
                    </TableCell>
                    <TableCell align='right'>
                      <Checkbox
                        checked={row.hasAuthManagement}
                        onChange={event => {
                          handleAcessTypeChange(row.id, 'hasAuthManagement', event.target.checked);
                        }}
                      ></Checkbox>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
