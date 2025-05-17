import { convertQueryParamsToString, getVisitorEmail, getVisitorId } from './query-params';

/**
 * Track a page view in the analytics system
 *
 * @param pagePath - The path of the page being viewed
 * @param queryParams - Optional query parameters as an object
 * @param userId - Optional user ID if the user is logged in
 */
export const trackPageView = async (pagePath: string, queryParams?: Record<string, string>, userId?: number): Promise<void> => {
  try {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Get or create visitor ID
    const visitorId = getVisitorId();

    // Get visitor email from localStorage
    const email = getVisitorEmail();

    // Get page URL (path only, no origin)
    const pageUrl = pagePath;

    // Log for debugging
    console.debug('Page view pageUrl:', pageUrl, 'queryParams:', queryParams);

    // Get user agent
    const userAgent = navigator.userAgent;

    // Convert query params to string
    const queryParamsString = convertQueryParamsToString(queryParams);

    // Make API call to store the page view
    await fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageUrl,
        visitorId,
        email,
        queryParams: queryParamsString,
        userAgent,
        userId,
        // Note: We don't include IP address here as it's better to capture that server-side
      }),
    });

    // Log for debugging (can be removed in production)
    console.debug('Page view tracked:', pagePath);
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    console.error('Error tracking page view:', error);
  }
};

export default trackPageView;
