import { v4 as uuidv4 } from 'uuid';

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
    let visitorId = localStorage.getItem('visitorId');

    // If no visitor ID exists, create one
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }

    // Check for user email in localStorage
    const checkInEmail = localStorage.getItem('checkInEmail');
    const checkInEmail2 = localStorage.getItem('checkInEmail2');
    const signInEmail = localStorage.getItem('signInEmail');

    // Helper function to strip double quotes from email values
    const stripQuotes = (value: string | null): string | null => {
      if (!value) return null;
      return value.replace(/^"|"$/g, '');
    };

    // Use the first available email, stripping any double quotes
    const email = stripQuotes(checkInEmail) || stripQuotes(checkInEmail2) || stripQuotes(signInEmail) || null;

    // Get page URL (path only, no origin)
    // If pagePath is not provided, use the current pathname
    const pageUrl = pagePath || window.location.pathname;

    // If queryParams is not provided, extract them from the current URL
    let finalQueryParams = queryParams;
    if (!finalQueryParams && typeof window !== 'undefined') {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      urlSearchParams.forEach((value, key) => {
        params[key] = value;
      });
      if (Object.keys(params).length > 0) {
        finalQueryParams = params;
      }
    }

    // Log for debugging
    console.debug('Click event pageUrl:', pageUrl, 'queryParams:', finalQueryParams);

    // Get user agent
    const userAgent = navigator.userAgent;

    // Prepare query params string
    const queryParamsString = finalQueryParams
      ? Object.entries(finalQueryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : null;

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
        // Note: We don't include IP address here as it's better to capture that server-side
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
