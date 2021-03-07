import Link from 'next/link';
import Layout from '../components/Layout';
import 'fontsource-roboto';
import { Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import MapExample from '../components/MapExample';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
});

const IndexPage = () => (
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
    </Layout>
  </ThemeProvider>
);

export default IndexPage;
