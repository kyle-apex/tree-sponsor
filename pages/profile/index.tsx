import Button from '@mui/material/Button';
import EditProfile from 'components/account/profile/EditProfile';
import Layout from 'components/layout/Layout';
import Link from 'next/link';
import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Profile = () => {
  return (
    <Layout title='Profile'>
      <EditProfile>
        <Link href='/account'>
          <Button variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
            <ChevronLeftIcon /> Back to Account
          </Button>
        </Link>
      </EditProfile>
    </Layout>
  );
};

export default Profile;
