import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'TreeFolksYP' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <header>
      <nav>
        <Link href='/'>
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href='/about'>
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href='/users'>
          <a>Users List</a>
        </Link>{' '}
        | <a href='/api/users'>Users API</a>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I’m here to stay (Footer)</span>
    </footer>
  </div>
);

export default Layout;
