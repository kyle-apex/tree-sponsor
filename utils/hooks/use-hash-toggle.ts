import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function useHashToggle(hash: string, defaultValue?: boolean) {
  const initial = !!defaultValue;
  const [value, setValue] = useState(initial || false);
  const router = useRouter();
  useEffect(() => {
    if (!router.asPath?.includes('#')) return;
    if (router.asPath.split('#')[1] == hash) setValue(true);
  }, []);
  const setHashValue = (value: boolean) => {
    //console.log('pathname', router.pathname);
    //console.log('path', router.asPath);
    //console.log('router', router);
    const path = router.asPath ? router.asPath.split('#')[0] : '';
    if (value) router.push(path, `#${hash}`);
    else router.push(path);
    setValue(value);
  };
  return [value, setHashValue];
}
