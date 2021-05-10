import Link from 'next/link';
import Layout from '../components/layout/Layout';
import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import MapExample from 'components/MapExample';

import { signIn, signOut, useSession } from 'next-auth/client';
import CheckoutButton from 'components/CheckoutButton';

const IndexPage = () => {
  const [session, loading] = useSession();
  return (
    <Layout>
      <h1>Hello Next.js 👋</h1>
      <CheckoutButton></CheckoutButton>

      <MapExample></MapExample>
      <p>
        <Link href='/about'>
          <Button color='primary' variant='contained'>
            About..
          </Button>
        </Link>
      </p>
      {!session && (
        <>
          Not signed in <br /> <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session?.user?.email} <br /> <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </Layout>
  );
};

export default IndexPage;
