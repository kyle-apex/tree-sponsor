import AdminLayout from 'components/layout/AdminLayout';

import React from 'react';
import RoleTable from 'components/admin/RoleTable';
import AddByName from 'components/AddByName';
import UserRoleTable from 'components/admin/UserRoleTable';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import { useGet } from 'utils/hooks/use-get';
import { Role } from '@prisma/client';
import axios from 'axios';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';

const RolesPage = () => {
  const { data: roles, refetch: refetchRoles, isFetching: isRolesFetching } = useGet<Role[]>('/api/roles', 'roles');
  const { data: users, isFetching: isUsersFetching } = useGet<Role[]>('/api/users', 'users');

  const { add } = useAddToQuery<Role>('roles', addRoleToDatabase);

  async function addRole(roleName: string) {
    return add({ name: roleName });
  }

  async function addRoleToDatabase(role: Partial<Role>) {
    const result = await axios.post('/api/roles', role);
    return result.data;
  }

  return (
    <AdminLayout title='Roles' header='Manage Roles'>
      <UserRoleTable roles={roles} users={users} isFetching={isUsersFetching}></UserRoleTable>
      <Divider></Divider>
      <RoleTable roles={roles} refetch={refetchRoles} isFetching={isRolesFetching}></RoleTable>
      <AddByName label='Add a Role' buttonText='Add Role' action={addRole}></AddByName>
    </AdminLayout>
  );
};

export default RolesPage;
