import Layout from 'components/layout/Layout';

import React from 'react';
import RoleTable from 'components/admin/RoleTable';
import AddByName from 'components/AddByName';
import UserRoleTable from 'components/admin/UserRoleTable';
import { Button, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useGet } from 'utils/hooks/use-get';
import { Role } from '@prisma/client';
import axios from 'axios';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
  backLink: {
    marginTop: theme.spacing(3),
  },
}));

const RolesPage = () => {
  const { data: roles, refetch: refetchRoles, isFetching: isRolesFetching } = useGet<Role[]>('/api/roles', 'roles');
  const { data: users, isFetching: isUsersFetching } = useGet<Role[]>('/api/users', 'users');

  const { add } = useAddToQuery('roles', addRoleToDatabase);

  const classes = useStyles();

  async function addRole(roleName: string) {
    return add({ name: roleName });
  }

  async function addRoleToDatabase(role: Partial<Role>) {
    const result = await axios.post('/api/roles', role);
    return result.data;
  }

  return (
    <Layout title='Roles'>
      <Link href='/admin/'>
        <Button variant='outlined' className={classes.backLink}>
          Back to Admin Home
        </Button>
      </Link>
      <h1>Manage Roles</h1>
      <UserRoleTable roles={roles} users={users} isFetching={isUsersFetching}></UserRoleTable>
      <Divider></Divider>
      <RoleTable roles={roles} refetch={refetchRoles} isFetching={isRolesFetching}></RoleTable>
      <AddByName label='Add a Role' buttonText='Add Role' action={addRole}></AddByName>
    </Layout>
  );
};

export default RolesPage;
