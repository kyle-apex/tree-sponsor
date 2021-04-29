import Link from 'next/link';
import Layout from '../components/Layout';
import 'fontsource-roboto';
import { Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import MapExample from '../components/MapExample';

import { signIn, signOut, useSession } from 'next-auth/client';
import Subscriptions from 'components/account/subscriptions/Subscriptions';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
});

const AccountPage = () => {
  const [session, loading] = useSession();
  return (
    <ThemeProvider theme={theme}>
      <Layout title='Home | Next.js + TypeScript Example'>
        <h1>Hello Next.js 👋</h1>
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
    </ThemeProvider>
  );
};

export default IndexPage;
