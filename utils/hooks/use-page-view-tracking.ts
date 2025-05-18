import { useEffect } from 'react';
import trackPageView from 'utils/analytics/track-page-view';

/**
 * Hook to track page views
 *
 * This hook automatically tracks page views when a component mounts
 * and when the route changes. It uses the window object to get the
 * current path and query parameters.
 *
 * Example usage:
 *
 * ```
 * // In your page component
 * const MyPage = () => {
 *   usePageViewTracking();
 *
 *   return (
 *     <div>
 *       <h1>My Page</h1>
 *       // Page content
 *     </div>
 *   );
 * };
 * ```
 */
export const usePageViewTracking = (): void => {
  useEffect(() => {
    // Skip during server-side rendering
    if (typeof window === 'undefined') return;

    // Parse query parameters from URL search string
    const getQueryParams = (): Record<string, string> => {
      const params: Record<string, string> = {};
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return params;
    };

    // Track the current page view
    trackPageView(window.location.pathname, getQueryParams());

    // Set up tracking for route changes
    const handleRouteChange = () => {
      trackPageView(window.location.pathname, getQueryParams());
    };

    // Create a MutationObserver to detect DOM changes that might indicate navigation
    const observer = new MutationObserver(() => {
      // Check if URL has changed since last check
      if (currentPath !== window.location.pathname || currentSearch !== window.location.search) {
        currentPath = window.location.pathname;
        currentSearch = window.location.search;
        handleRouteChange();
      }
    });

    // Store current location to detect changes
    let currentPath = window.location.pathname;
    let currentSearch = window.location.search;

    // Start observing the document with the configured parameters
    observer.observe(document, { subtree: true, childList: true });

    // Listen for popstate events (browser back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Intercept history methods to detect programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    // Clean up event listeners and observers
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      observer.disconnect();

      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
};

export default usePageViewTracking;
