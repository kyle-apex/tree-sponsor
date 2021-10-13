import React from 'react';
// Modules
import Document, { Html, Head, Main, NextScript } from 'next/document';
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';
// Utils
import theme from 'utils/theme';
import createEmotionCache from 'utils/create-emotion-cache';
import { getSession } from 'utils/auth/get-session';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
import createEmotionServer from '@emotion/server/create-instance';
import { JssProvider } from 'react-jss';

class MyDocument extends Document {
  render() {
    return (
      <JssProvider>
        <Html lang='en'>
          <Head>
            <meta name='theme-color' content={theme.palette.primary.main} />

            <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap' />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </JssProvider>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  /* ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });
*/
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => props => sheets.collect(<App emotionCache={cache} {...props} />),
    });

  const { query, req } = ctx;

  // if refresh, do refresh
  if (query?.refresh === 'me') {
    const session = await getSession({ req });
    if (session?.user?.email) {
      await updateSubscriptionsForUser(session?.user?.email);
    }
    delete query.refresh;
  }

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement(), ...emotionStyleTags], // sheets.getStyleElement()],
    materialStyle: sheets.getStyleElement(),
  };
};

export default MyDocument;
