import Layout from 'components/layout/Layout';
import { useSession } from 'next-auth/client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';

const AccountRedirectPage = () => {
  const router = useRouter();
  const [session] = useSession();

  const checkRedirect = () => {
    if (session) router.push('/account');
  };

  useEffect(() => {
    if (session) router.push('/account');
  }, [session]);

  return <Layout title='Account'></Layout>;
};

export default AccountRedirectPage;
