import { useRouter } from 'next/router';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export default function useHashToggle(hash: string, defaultValue?: boolean): [boolean, (value: boolean) => void] {
  const initial = !!defaultValue;
  const router = useRouter();
  const initialValueFromRoute = router.asPath?.includes('#') && router.asPath.split('#')[1] == hash;

  const [value, setValue] = useState(initialValueFromRoute || initial || false);

  useEffect(() => {
    if (!router.asPath?.includes('#')) return;
    if (router.asPath.split('#')[1] == hash) setValue(true);
  }, []);
  const setHashValue = (value: boolean) => {
    const path = router.asPath ? router.asPath.split('#')[0] : '';
    if (value) router.push(path, `#${hash}`);
    else router.push(path);
    setValue(value);
  };
  return [value, setHashValue];
}
