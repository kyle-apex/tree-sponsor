import React from 'react';
// Modules
import { AppProps } from 'next/app';
import Head from 'next/head';
// MUI Core
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme } from '@mui/material/styles';
// Utils
import theme from '../utils/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'fontsource-roboto';
import '../styles.css';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'utils/create-emotion-cache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = ({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps): JSX.Element => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const queryClient = new QueryClient();

  return (
    <NextAuthProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>My App</title>
            <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            <link
              href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css'
              rel='stylesheet'
            />{' '}
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
    </NextAuthProvider>
  );
};

// THIS DOES NOT WORK
/*
MyApp.getInitialProps = async ({ req, query }: NextPageContext) => {
  

  return {};
};*/

export default MyApp;
