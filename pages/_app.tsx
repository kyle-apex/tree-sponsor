import React from 'react';
// Modules
import { AppProps } from 'next/app';
import Head from 'next/head';
// MUI Core
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
// Utils
import theme from '../utils/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles.css';
import { Provider as NextAuthProvider } from 'next-auth/client';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
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
        <Head>
          <title>My App</title>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        </Head>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </NextAuthProvider>
  );
};

export default MyApp;
