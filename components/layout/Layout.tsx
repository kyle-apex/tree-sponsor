import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'TreeFolksYP' }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <Header />
    <main>{children}</main>
    <Footer />
    <style jsx global>
      {`
        html,
        body {
          background: #f9f9f9;
          overflow-x: hidden;
          padding: 0 !important;
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
