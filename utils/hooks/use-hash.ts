import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getUrlHash(url: string): string {
  if (!url?.includes('#')) return;
  let hash = url.split('#')[1];
  hash = hash.split('?')[0];
  return hash;
}

export default function useHash(hash: string): [string, (value: string) => void] {
  const [value, setValue] = useState(hash);
  const router = useRouter();
  useEffect(() => {
    const hash = getUrlHash(router?.asPath);
    if (hash) setValue(hash);
  }, []);

  useEffect(() => {
    const onHashChangeStart = (url: string) => {
      const hash = getUrlHash(url);
      if (hash && hash != value) setValue(hash);
    };

    onHashChangeStart(router.asPath);

    router.events.on('hashChangeStart', onHashChangeStart);

    return () => {
      router.events.off('hashChangeStart', onHashChangeStart);
    };
  }, [router.events]);

  const setHashValue = (value: string) => {
    const path = router.asPath ? router.asPath.split('#')[0] : '';
    if (value) router.push(path, `#${value}`);
    else router.push(path);
    setValue(value);
  };
  return [value, setHashValue];
}
