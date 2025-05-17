import { useEffect } from 'react';
import { useRouter } from 'next/router';
import trackPageView from 'utils/analytics/track-page-view';

/**
 * Hook to track page views
 *
 * This hook automatically tracks page views when a component mounts
 * and when the route changes. It uses the Next.js router to get the
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
  const router = useRouter();

  useEffect(() => {
    // Skip during route transitions and only track when path is ready
    if (!router.isReady) return;

    // Track the current page view
    trackPageView(router.pathname, router.query as Record<string, string>);

    // Set up tracking for route changes
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    // Subscribe to route change events
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up event listener
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.isReady, router.pathname, router.query]);
};

export default usePageViewTracking;
