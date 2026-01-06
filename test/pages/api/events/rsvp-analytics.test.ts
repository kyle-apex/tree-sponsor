/**
 * This test file uses partial mocks that only implement the properties needed for testing.
 *
 * NOTE: The TypeScript errors in this file are expected and can be ignored.
 * These errors occur because we're using simplified mock objects that only contain
 * the properties used by the implementation, rather than creating full Prisma model objects.
 *
 * In a real-world scenario, we would use proper typing for all objects, but for testing
 * purposes, this approach reduces boilerplate while still effectively testing the functionality.
 */
import { testApiHandler } from 'next-test-api-route-handler';
import { prismaMock } from '../../../../utils/prisma/singleton';
import handler from '../../../../pages/api/events/rsvp-analytics';

// Define the PageViewRaw interface to match the one in the implementation
interface PageViewRaw {
  visitorId: string | null;
  queryParams: string | null;
  ipAddress: string | null;
}

// Add a comment explaining the use of type assertions in tests
/**
 * Note: In this test file, we use type assertions (as any) for our mock objects.
 * This is a common practice in tests where we only need to provide the specific
 * properties that are used by the implementation, rather than creating full
 * objects that satisfy all the type requirements.
 *
 * In a production code, we would use proper typing, but for tests this approach
 * reduces boilerplate while still testing the functionality.
 */

// Mock console.log to avoid cluttering test output
jest.spyOn(console, 'log').mockImplementation(jest.fn());
jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('RSVP Analytics API', () => {
  // Mock objects with only the fields needed for the test
  const mockEvent = {
    id: 1,
    path: 'test-event',
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    image: 'https://example.com/image.jpg',
  };

  // Define mock page views that match the PageViewRaw interface
  const mockPageViews: PageViewRaw[] = [
    // Same visitor ID, different IP addresses - should count as one visitor
    {
      visitorId: 'visitor1',
      ipAddress: '1.1.1.1',
      queryParams: 'u=1',
    },
    {
      visitorId: 'visitor1',
      ipAddress: '2.2.2.2',
      queryParams: 'u=1',
    },
    // Same IP address, different visitor IDs - should count as one visitor
    {
      visitorId: 'visitor2',
      ipAddress: '3.3.3.3',
      queryParams: 'u=1',
    },
    {
      visitorId: 'visitor3',
      ipAddress: '3.3.3.3',
      queryParams: 'u=1',
    },
    // Different visitor ID and IP address - should count as a new visitor
    {
      visitorId: 'visitor4',
      ipAddress: '4.4.4.4',
      queryParams: 'u=1',
    },
  ];

  const mockRsvps = [
    {
      invitedByUserId: 1,
      status: 'going',
    },
    {
      invitedByUserId: 1,
      status: 'maybe',
    },
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST' });
        expect(res.status).toBe(405);
      },
    });
  });

  it('should return 400 if eventId is missing', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        expect(res.status).toBe(400);
      },
    });
  });

  it('should return 404 if event is not found', async () => {
    // Mock returning null for event lookup
    // @ts-expect-error - We're intentionally using a simplified mock for testing
    prismaMock.event.findUnique.mockResolvedValue(null);

    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        expect(res.status).toBe(404);
      },
      params: { eventId: '999' },
    });
  });

  it('should correctly count unique visitors based on visitor ID and IP address', async () => {
    // Mock the event lookup
    // @ts-expect-error - We're intentionally using a simplified mock for testing
    prismaMock.event.findUnique.mockResolvedValue(mockEvent);

    // Mock the raw query for page views with proper typing
    prismaMock.$queryRaw.mockResolvedValue(mockPageViews);

    // Mock user lookup
    // @ts-expect-error - We're intentionally using a simplified mock for testing
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    // Mock RSVP lookup
    // @ts-expect-error - We're intentionally using a simplified mock for testing
    prismaMock.eventRSVP.findMany.mockResolvedValue(mockRsvps);

    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        expect(res.status).toBe(200);

        const data = await res.json();

        // We should have one user in the analytics
        expect(data.length).toBe(1);

        // The user should have 3 unique page views:
        // 1. visitor1 with IPs 1.1.1.1 and 2.2.2.2 (counts as 1)
        // 2. visitor2/visitor3 with IP 3.3.3.3 (counts as 1)
        // 3. visitor4 with IP 4.4.4.4 (counts as 1)
        expect(data[0].uniquePageViews).toBe(3);

        // Verify other analytics data
        expect(data[0].userId).toBe(1);
        expect(data[0].userName).toBe('Test User');
        expect(data[0].totalRSVPs).toBe(2);
        expect(data[0].rsvpsByStatus.going).toBe(1);
        expect(data[0].rsvpsByStatus.maybe).toBe(1);
      },
      params: { eventId: '1' },
    });
  });
});
