import Layout from 'components/layout/Layout';
import { useSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const AccountRedirectPage = () => {
  const router = useRouter();
  const [session] = useSession();

  const checkRedirect = () => {
    if (session) router.push('/account');
  };

  useEffect(() => {
    checkRedirect();
  }, [session]);

  return <Layout title='Account'></Layout>;
};

export default AccountRedirectPage;
