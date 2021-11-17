import { Session } from 'interfaces';
import { useSession } from 'next-auth/client';
import React, { useEffect, useLayoutEffect } from 'react';
const Acute = () => {
  const [session] = useSession();
  useEffect(() => {
    if (session?.user) {
      const user = (session as Session).user;

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window && window['Acute']) {
          const acuteUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarURL: user.image,
          };
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.Acute('identify', {
            user: acuteUser,
          });
        }
      }, 1100);
    }
  }, [session]);

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window['actSettings'] = {
      token: '5341810786e351e022366871cd411e0f8b28ab310a30d6065672d54d7edf85bc',
    };
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window !== 'undefined' && !window['isAcuteInitialized']) {
      console.log('initting');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window['isAcuteInitialized'] = true;
      const script = document.createElement('script');
      script.src = '/acute.js';
      document.body.appendChild(script);
    }
  }, []);

  return <></>;
};

export default Acute;
