# Page View Tracking Utility

This utility provides a simple way to track page views across the application.

## Features

- Tracks page views with unique visitor IDs
- Captures user emails when available
- Handles query parameters for unique visit tracking
- Stores data in the database for analytics

## Usage

### Using the Hook (Recommended)

The easiest way to implement page view tracking is to use the provided hook:

```tsx
import { usePageViewTracking } from 'utils/hooks/use-page-view-tracking';

const MyPage = () => {
  // This will automatically track page views
  usePageViewTracking();
  
  return (
    <div>
      <h1>My Page</h1>
      {/* Page content */}
    </div>
  );
};

export default MyPage;
```

### Basic Usage

Import the utility in your page component and call it in a `useEffect` hook:

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import trackPageView from 'utils/analytics/track-page-view';

const MyPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Track the page view when the component mounts
    trackPageView(router.pathname, router.query);
  }, [router.pathname, router.query]);
  
  return (
    <div>
      <h1>My Page</h1>
      {/* Page content */}
    </div>
  );
};

export default MyPage;
```

### Adding to _app.tsx (for tracking all pages)

To track all pages automatically, you can add the tracking to the `_app.tsx` file:

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import trackPageView from 'utils/analytics/track-page-view';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Track initial page load
    trackPageView(router.pathname, router.query);
    
    // Track page changes
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  return <Component {...pageProps} />;
}

export default MyApp;
```

### Tracking Unique Visits

The utility automatically handles query parameters like `?u=1` or `?u=2` to log them as separate unique visits. This is useful for tracking different sources of traffic to the same page.

For example, if you share a link with `?u=1` for social media and `?u=2` for email campaigns, you can track which source drives more traffic.