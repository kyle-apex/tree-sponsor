import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { Box, Container } from '@mui/material';

type Props = {
  children?: ReactNode;
  title?: string;
  isFullWidth?: boolean;
};

const Layout = ({ children, title = 'TreeFolksYP', isFullWidth }: Props) => (
  <>
    <Head>
      <title>
        {title}
        {title != 'TreeFolksYP' ? ` - TreeFolksYP` : ``}
      </title>
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <Header />
    <main>
      {isFullWidth ? (
        <Box sx={{ paddingTop: theme => theme.spacing(2) }}>
          <Box mb={6}>{children}</Box>
        </Box>
      ) : (
        <Container maxWidth='lg' sx={{ paddingTop: theme => theme.spacing(2) }}>
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
