import { v4 as uuidv4 } from 'uuid';

/**
 * Track a page view in the analytics system
 *
 * @param pagePath - The path of the page being viewed
 * @param queryParams - Optional query parameters as an object
 */
export const trackPageView = async (pagePath: string, queryParams?: Record<string, string>): Promise<void> => {
  try {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Get or create visitor ID
    let visitorId = localStorage.getItem('visitorId');

    // Handle unique visit tracking via query params
    if (queryParams?.u) {
      // If u parameter is present, create a new unique visit ID
      visitorId = `${visitorId || ''}-u${queryParams.u}`;
    }

    // If no visitor ID exists, create one
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }

    // Check for user email in localStorage
    const checkInEmail = localStorage.getItem('checkInEmail');
    const checkInEmail2 = localStorage.getItem('checkInEmail2');
    const signInEmail = localStorage.getItem('signInEmail');

    // Use the first available email
    const email = checkInEmail || checkInEmail2 || signInEmail || null;

    // Get full page URL
    const pageUrl = window.location.origin + pagePath;

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
