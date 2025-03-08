import { useState, useEffect } from 'react';

/**
 * Custom hook to get and track window dimensions
 * @returns {Object} window dimensions (width and height)
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Function to update window size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Call handler right away to update initial size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures effect runs only on mount/unmount

  return windowSize;
};

export default useWindowSize;
