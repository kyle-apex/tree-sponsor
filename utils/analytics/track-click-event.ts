import { getQueryParams, convertQueryParamsToString, getVisitorEmail, getVisitorId } from './query-params';

/**
 * Track a click event in the analytics system
 *
 * @param actionName - The name of the action/button that was clicked
 * @param destinationUrl - The URL where the click leads to (if applicable)
 * @param pagePath - The path of the page where the click occurred
 * @param queryParams - Optional query parameters as an object
 * @param userId - Optional user ID if the user is logged in
 */
export const trackClickEvent = async (
  actionName: string,
  destinationUrl?: string,
  pagePath?: string,
  queryParams?: Record<string, string>,
  userId?: number,
): Promise<void> => {
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
    // If pagePath is not provided, use the current pathname
    const pageUrl = pagePath || window.location.pathname;

    // Get query params from provided params or from URL
    const finalQueryParams = getQueryParams(queryParams);

    // Log for debugging
    console.debug('Click event pageUrl:', pageUrl, 'queryParams:', finalQueryParams);

    // Get user agent
    const userAgent = navigator.userAgent;

    // Convert query params to string
    const queryParamsString = convertQueryParamsToString(finalQueryParams);

    // Make API call to store the click event
    await fetch('/api/analytics/click-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageUrl,
        actionName,
        destinationUrl,
        visitorId,
        email,
        queryParams: queryParamsString,
        userAgent,
        userId,
      }),
    });

    // Log for debugging (can be removed in production)
    console.debug('Click event tracked:', actionName, destinationUrl);
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    console.error('Error tracking click event:', error);
  }
};

export default trackClickEvent;
