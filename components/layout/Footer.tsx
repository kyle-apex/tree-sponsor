import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <hr />
      <div className='legal'>
        <div className='legal-copyright'>Copyright © 2021 TreeFolks Young Professionals. All rights reserved.</div>
        <div className='legal-links'>
          <Link className='legal-link' href='/legal/privacy'>
            <a>Privacy</a>
          </Link>
          <Link className='legal-link' href='/legal/terms'>
            <a>Terms</a>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .legal {
          padding: 0px 10px 10px 10px;
        }
        .legal > div {
          display: inline-block;
        }
        .legal-copyright {
          margin-right: 20px;
          color: var(--light-text-color);
        }
        hr {
          color: var(--light-text-color);
        }
        a {
          padding: 0 15px;
          text-decoration: none;
          color: var(--secondary-text-color);
        }
        a:not(:last-child) {
          border-right: solid 1px var(--light-text-color);
        }
        a:first-child {
          padding-left: 0;
        }
      `}</style>
    </footer>
  );
};
export default Footer;
