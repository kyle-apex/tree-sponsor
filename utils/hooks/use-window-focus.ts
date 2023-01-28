import { useEffect } from 'react';
const useWindowFocus = (onFocus: () => void, dependencies: any[]) => {
  useEffect(() => {
    const listener = () => {
      if (window?.document?.hasFocus()) onFocus();
    };
    window.addEventListener('focus', listener, false);
    window.addEventListener('visibilitychange', listener, false);

    return () => {
      window.removeEventListener('focus', listener);
      window.removeEventListener('visibilitychange', listener);
    };
  }, dependencies || []);
};
export default useWindowFocus;
