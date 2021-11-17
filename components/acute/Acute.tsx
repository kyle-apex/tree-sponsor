import React, { useLayoutEffect } from 'react';
const Acute = () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window['actSettings'] = {
      token: '5341810786e351e022366871cd411e0f8b28ab310a30d6065672d54d7edf85bc',
    };
  }
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');

      script.src = '/acute.js';

      document.body.appendChild(script);
    }
  }, []);
  return <></>;
};

export default Acute;
