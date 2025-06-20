import React, { ReactNode } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Header from './Header';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Acute from 'components/acute/Acute';
import { BASE_TITLE } from 'consts';

type Props = {
  children?: ReactNode;
  title?: string;
  titleOverride?: string;
  isFullWidth?: boolean;
  description?: string;
  ogImage?: string;
  header?: string;
};

const Layout = ({
  children,
  title = 'TreeFolksYP',
  titleOverride,
  header,
  isFullWidth,
  description = 'TreeFolks Young Professionals (ages 21–40ish) volunteer, educate, fundraise, and build community in support of the mission of TreeFolks: planting, caring for, and giving people free trees to plant!',
  ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || '/preview-images/index.jpeg',
}: Props) => (
  <>
    <Head>
      <title>{titleOverride ? titleOverride : title != BASE_TITLE ? title + ` - ${BASE_TITLE}` : title}</title>
      {ogImage && <meta property='og:image' content={ogImage} key='ogimage' />}
      {(titleOverride || title) && (
        <meta
          property='og:title'
          content={titleOverride ? titleOverride : title != BASE_TITLE ? title + ` - ${BASE_TITLE}` : title}
          key='ogtitle'
        />
      )}
      {description && <meta property='og:description' content={description} key='ogdesc' />}
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, maximum-scale=1, user-scalable=no' />

      <link href='/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <Script id='hotjar-tracking' strategy='afterInteractive'>
      {`
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:6428977,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
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
