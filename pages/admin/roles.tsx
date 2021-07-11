import Layout from 'components/layout/Layout';

import React from 'react';
import RoleTable from 'components/admin/RoleTable';
import AddByName from 'components/AddByName';
import UserRoleTable from 'components/admin/UserRoleTable';
import { Divider } from '@material-ui/core';
import { useGet } from 'utils/hooks/use-get';
import { Role } from '@prisma/client';

const RolesPage = () => {
  const { data: roles, refetch: refetchRoles } = useGet<Role[]>('/api/roles', 'roles');
  const { data: users, refetch: refetchUsers } = useGet<Role[]>('/api/users', 'users');

  return (
    <Layout title='Roles'>
      <h1>Manage Roles</h1>
      <UserRoleTable roles={roles} users={users} refetch={refetchUsers}></UserRoleTable>
      <Divider></Divider>
      <RoleTable roles={roles} refetch={refetchRoles}></RoleTable>
      <AddByName></AddByName>
    </Layout>
  );
};

export default RolesPage;
