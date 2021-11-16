import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

type Props = {
  children?: ReactNode;
  title?: string;
  isFullWidth?: boolean;
  description?: string;
  ogImage?: string;
};

const Layout = ({
  children,
  title = 'Thank-a-Tree | TreeFolksYP',
  isFullWidth,
  description = 'Thank your favorite trees with a Token of Appre-tree-ation in support of future tree plantings through TreeFolks Young Professionals (TreeFolksYP)',
  ogImage = '/og-image.png',
}: Props) => (
  <>
    <Head>
      <title>
        {title}
        {title != 'Thank-a-Tree | TreeFolksYP' ? ` - Thank-a-Tree | TreeFolksYP` : ``}
      </title>
      {ogImage && <meta property='og:image' content={ogImage} key='ogimage' />}
      {title && (
        <meta
          property='og:title'
          content={title != 'Thank-a-Tree | TreeFolksYP' ? title + ' - Thank-a-Tree | TreeFolksYP' : title}
          key='ogtitle'
        />
      )}
      {description && <meta property='og:description' content={description} key='ogdesc' />}
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, maximum-scale=1' />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <Header />
    <main>
      {isFullWidth ? (
        <Box sx={{ paddingTop: theme => theme.spacing(2) }}>
          <Box mb={6}>{children}</Box>
        </Box>
      ) : (
        <Container maxWidth='lg' sx={{ paddingTop: theme => theme.spacing(3) }}>
          <Box mb={6}>{children}</Box>
        </Container>
      )}
    </main>
    <Footer />
    <style jsx global>
      {`
        html,
        body {
          /*background: #f9f9f9;*/
          background: url(/background-lighter.svg);
          overflow-x: hidden;
          padding: 0 !important;
        }
        html {
          --secondary-text-color: #515154;
          --light-text-color: #86868b;
        }
        #__next {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        main {
          flex: 1;
        }
      `}
    </style>
  </>
);

export default Layout;
