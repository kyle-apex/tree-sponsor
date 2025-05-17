import { v4 as uuidv4 } from 'uuid';

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
    const pageUrl = pagePath;

    // Log for debugging
    console.debug('Page view pageUrl:', pageUrl, 'queryParams:', queryParams);

    // Get user agent
    const userAgent = navigator.userAgent;

    // Prepare query params string
    const queryParamsString = queryParams
      ? Object.entries(queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : null;

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
