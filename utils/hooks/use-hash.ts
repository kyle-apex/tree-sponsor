import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getUrlHash(url: string): string {
  if (!url?.includes('#')) return;
  let hash = url.split('#')[1];
  hash = hash.split('?')[0];
  return hash;
}

export default function useHash(hash: string, validHashes?: string[]): [string, (value: string) => void] {
  const [value, setValue] = useState(hash);
  const router = useRouter();
  useEffect(() => {
    const urlHash = getUrlHash(router?.asPath);
    if (urlHash && (!validHashes || validHashes.includes(urlHash))) setValue(hash);
  }, []);

  useEffect(() => {
    const onHashChangeStart = (url: string) => {
      const hash = getUrlHash(url);
      if (hash && hash != value && (!validHashes || validHashes.includes(hash))) setValue(hash);
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
