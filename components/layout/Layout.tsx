import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Acute from 'components/acute/Acute';
import { BASE_TITLE } from 'consts';

type Props = {
  children?: ReactNode;
  title?: string;
  isFullWidth?: boolean;
  description?: string;
  ogImage?: string;
  header?: string;
};

const Layout = ({
  children,
  title = 'TreeFolksYP',
  header,
  isFullWidth,
  description = 'TreeFolks Young Professionals (ages 21–40ish) volunteer, educate, fundraise, and build community in support of the mission of TreeFolks: planting, caring for, and giving people free trees to plant!',
  ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || '/preview-images/index.jpeg',
}: Props) => (
  <>
    <Head>
      <title>
        {title}
        {title != BASE_TITLE ? ` - ${BASE_TITLE}` : ``}
      </title>
      {ogImage && <meta property='og:image' content={ogImage} key='ogimage' />}
      {title && <meta property='og:title' content={title != BASE_TITLE ? title + ` - ${BASE_TITLE}` : title} key='ogtitle' />}
      {description && <meta property='og:description' content={description} key='ogdesc' />}
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, maximum-scale=1, user-scalable=no' />

      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <Acute />
    <Header title={header} />
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
