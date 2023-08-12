import React from 'react';
// Modules
import { AppProps } from 'next/dist/shared/lib/router/router';
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
import IdentifyTreeProvider from 'components/tree/IdentifyTreeProvider';

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window['actSettings'] = {
      token: '5341810786e351e022366871cd411e0f8b28ab310a30d6065672d54d7edf85bc',
      widget: {
        type: 'modal',
        selector: '#feedback',
      },
    };

    // fix bold google maps issue
    const head = document.getElementsByTagName('head')[0];

    // Save the original method
    const insertBefore = head.insertBefore;

    // Replace it!
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    head.insertBefore = function (newElement, referenceElement) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (newElement.href && newElement.href.indexOf('https://fonts.googleapis.com/css?family=Roboto') === 0) {
        return;
      }

      insertBefore.call(head, newElement, referenceElement);
    };
  }, []);

  const queryClient = new QueryClient();

  return (
    <NextAuthProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <IdentifyTreeProvider>
            <Head>
              <title>Thank-a-Tree | TreeFolksYP</title>
              <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, maximum-scale=1' />
              <meta property='og:type' content='website' />
              <meta property='fb:app_id' content={process.env.NEXT_PUBLIC_FACEBOOK_ID} />
              <link
                href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css'
                rel='stylesheet'
              />{' '}
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </IdentifyTreeProvider>
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
