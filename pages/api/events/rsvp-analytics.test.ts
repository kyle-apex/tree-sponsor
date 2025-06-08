import { NextApiRequest, NextApiResponse } from 'next';
// No direct import from 'utils/prisma/init' needed here as it's fully mocked.

// Handler will be imported dynamically after mocks are set up.
let handler: any;

// Mock Prisma client
const mockPrismaClient = {
  event: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  eventRSVP: {
    findMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

// Helper to mock req/res objects
const mockRequestResponse = (method: string, query: any, body?: any) => {
  const req = { method, query, body } as NextApiRequest;
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res: res as NextApiResponse };
};

// IMPORTANT: Mock prisma client *after* mockPrismaClient is defined.
jest.mock('utils/prisma/init', () => ({
  prisma: mockPrismaClient,
}));

describe('GET /api/events/rsvp-analytics', () => {
  beforeAll(() => {
    // Import the handler after mocks are set up
    handler = require('./rsvp-analytics').default;
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const eventId = 1;
  const eventPath = 'test-event';

  // Default mock for event.findUnique, can be overridden in specific tests
  mockPrismaClient.event.findUnique.mockResolvedValue({ path: eventPath });

  test('Test Case 1: Same visitorId, different ipAddress -> 1 unique view', async () => {
    const invitingUserId = 100;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
      { visitorId: 'v1', ipAddress: '2.2.2.2', queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(invitingUserId);
    expect(result[0].uniquePageViews).toBe(1);
  });

  test('Test Case 2: Different visitorId, same ipAddress -> 1 unique view', async () => {
    const invitingUserId = 101;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
      { visitorId: 'v2', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(invitingUserId);
    expect(result[0].uniquePageViews).toBe(1);
  });

  test('Test Case 3: Different visitorId, different ipAddress -> 2 unique views', async () => {
    const invitingUserId = 102;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
      { visitorId: 'v2', ipAddress: '2.2.2.2', queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(invitingUserId);
    expect(result[0].uniquePageViews).toBe(2);
  });

  test('Test Case 4: Same visitorId, same ipAddress -> 1 unique view', async () => {
    const invitingUserId = 103;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(invitingUserId);
    expect(result[0].uniquePageViews).toBe(1);
  });

  test('Test Case 5: Multiple different visitors for a single inviting user -> 3 unique views and correct RSVPs', async () => {
    const invitingUserId = 104;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    // New, simplified data for Test Case 5, expecting 3 unique views:
    // 1. v1, ip1 (Unique)
    // 2. v1, ip2 (Not unique - v1 seen)
    // 3. v2, ip3 (Unique)
    // 4. v3, ip3 (Not unique - ip3 seen)
    // 5. v4, ip4 (Unique)
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'TC5_v1', ipAddress: 'TC5_ip1', queryParams: `?u=${invitingUserId}` }, // View 1 - Unique
      { visitorId: 'TC5_v1', ipAddress: 'TC5_ip2', queryParams: `?u=${invitingUserId}` }, // View 2 - Not Unique (v1 seen)
      { visitorId: 'TC5_v2', ipAddress: 'TC5_ip3', queryParams: `?u=${invitingUserId}` }, // View 3 - Unique
      { visitorId: 'TC5_v3', ipAddress: 'TC5_ip3', queryParams: `?u=${invitingUserId}` }, // View 4 - Not Unique (ip3 seen)
      { visitorId: 'TC5_v4', ipAddress: 'TC5_ip4', queryParams: `?u=${invitingUserId}` }, // View 5 - Unique
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([
      { invitedByUserId: invitingUserId, status: 'GOING' },
      { invitedByUserId: invitingUserId, status: 'MAYBE' },
    ]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(invitingUserId);
    expect(result[0].uniquePageViews).toBe(3);
    expect(result[0].totalRSVPs).toBe(2);
    expect(result[0].rsvpsByStatus.going).toBe(1);
    expect(result[0].rsvpsByStatus.maybe).toBe(1);
  });

  test('Test Case 6: Multiple inviting users with various visitor combinations', async () => {
    const invitingUserId1 = 201;
    const invitingUserId2 = 202;

    mockPrismaClient.user.findUnique
      .mockImplementation(async (options: { where: { id: number } }) => {
        if (options.where.id === invitingUserId1) {
          return { id: invitingUserId1, name: 'Inviter One', image: null };
        }
        if (options.where.id === invitingUserId2) {
          return { id: invitingUserId2, name: 'Inviter Two', image: null };
        }
        return null;
      });

    mockPrismaClient.$queryRaw.mockResolvedValue([
      // User 1: should be 1 unique view
      { visitorId: 'v1', ipAddress: '3.1.1.1', queryParams: `?u=${invitingUserId1}` },
      { visitorId: 'v1', ipAddress: '3.1.1.2', queryParams: `?u=${invitingUserId1}` },
      // User 2: should be 2 unique views
      { visitorId: 'v2', ipAddress: '3.1.2.1', queryParams: `?u=${invitingUserId2}` }, // Unique for user2 #1
      { visitorId: 'v3', ipAddress: '3.1.2.2', queryParams: `?u=${invitingUserId2}` }, // Unique for user2 #2
      { visitorId: 'v3', ipAddress: '3.1.2.3', queryParams: `?u=${invitingUserId2}` }, // Not unique for user2
    ]);

    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([
      { invitedByUserId: invitingUserId1, status: 'GOING' },
      { invitedByUserId: invitingUserId2, status: 'DECLINED' },
      { invitedByUserId: invitingUserId2, status: 'INVITED' },
    ]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const results = (res.json as jest.Mock).mock.calls[0][0];
    expect(results).toHaveLength(2);

    const user1Analytics = results.find((r: any) => r.userId === invitingUserId1);
    const user2Analytics = results.find((r: any) => r.userId === invitingUserId2);

    expect(user1Analytics.uniquePageViews).toBe(1);
    expect(user1Analytics.totalRSVPs).toBe(1);
    expect(user1Analytics.rsvpsByStatus.going).toBe(1);

    expect(user2Analytics.uniquePageViews).toBe(2);
    expect(user2Analytics.totalRSVPs).toBe(2);
    expect(user2Analytics.rsvpsByStatus.declined).toBe(1);
    expect(user2Analytics.rsvpsByStatus.invited).toBe(1);
  });

  test('Test Case 7: No page views found', async () => {
    mockPrismaClient.$queryRaw.mockResolvedValue([]);
    // eventRSVP.findMany will also be empty as no userIds are processed
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);


    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toEqual([]);
  });

  test('Test Case 8: Page views present but no u (invitingUserId) parameter', async () => {
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: '?param=test' }, // No 'u'
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);


    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toEqual([]);
  });

  test('Test Case 9: Event not found', async () => {
    mockPrismaClient.event.findUnique.mockResolvedValueOnce(null); // Simulate event not found

    const { req, res } = mockRequestResponse('GET', { eventId: '999' }); // Non-existent event
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({ message: 'Event not found' });
  });

  test('Test Case 10: Page views with invalid u parameter (not a number)', async () => {
    const validInvitingUserId = 300;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: validInvitingUserId, name: 'Valid User', image: null });

    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: '?u=abc' }, // Invalid 'u'
      { visitorId: 'v2', ipAddress: '2.2.2.2', queryParams: `?u=${validInvitingUserId}` }, // Valid 'u'
      { visitorId: 'v2', ipAddress: '3.3.3.3', queryParams: `?u=${validInvitingUserId}` }, // Valid 'u', same visitorId as above
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);


    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toHaveLength(1); // Only the valid user should appear
    expect(result[0].userId).toBe(validInvitingUserId);
    expect(result[0].uniquePageViews).toBe(1); // For v2 (first occurrence)
  });

  test('Page view with null visitorId and null ipAddress (should be counted as unique if both are new)', async () => {
    const invitingUserId = 400;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      // This specific scenario depends on how nulls are treated.
      // The current logic: if (currentVisitorId) and if (currentIpAddress) means nulls aren't added to sets.
      // So, two views with (null, null) would both appear "new" because nothing is added to sets.
      // This would result in 2 unique page views if they are the only views.
      // However, if the intent is that (null, 'ip1') and (null, 'ip2') are unique, but ('id1', null) and ('id2', null) are unique,
      // then (null,null) vs (null,null) is tricky.
      // The current code: isUnique = true initially.
      // if (null && seenVisitorIds.has(null)) -> false, isUnique remains true.
      // if (null && seenIpAddresses.has(null)) -> false, isUnique remains true.
      // So it will be counted as unique. And nulls won't be added. So two (null,null) will be 2 unique views.
      { visitorId: null, ipAddress: null, queryParams: `?u=${invitingUserId}` },
      { visitorId: null, ipAddress: null, queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result[0].uniquePageViews).toBe(2);
  });

  test('Page view with visitorId and null ipAddress, then another with same visitorId and different null ipAddress', async () => {
    const invitingUserId = 401;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v-real', ipAddress: null, queryParams: `?u=${invitingUserId}` }, // Unique #1 (v-real is new, ip:null is new) -> v-real added to seenVisitorIds
      { visitorId: 'v-real', ipAddress: null, queryParams: `?u=${invitingUserId}` }, // Not unique (v-real is seen)
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);
    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result[0].uniquePageViews).toBe(1);
  });

   test('Page view with null visitorId and real ipAddress, then another with null visitorId and different real ipAddress', async () => {
    const invitingUserId = 402;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce({ id: invitingUserId, name: 'Inviter User', image: null });
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: null, ipAddress: '8.8.8.8', queryParams: `?u=${invitingUserId}` }, // Unique #1 (vid:null is new, ip:8.8.8.8 is new) -> 8.8.8.8 added to seenIpAddresses
      { visitorId: null, ipAddress: '8.8.4.4', queryParams: `?u=${invitingUserId}` }, // Unique #2 (vid:null is new, ip:8.8.4.4 is new) -> 8.8.4.4 added to seenIpAddresses
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);
    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result[0].uniquePageViews).toBe(2);
  });

  test('User not found in database for an invitingUserId', async () => {
    const invitingUserId = 500;
    mockPrismaClient.user.findUnique.mockResolvedValueOnce(null); // User not found
    mockPrismaClient.$queryRaw.mockResolvedValue([
      { visitorId: 'v1', ipAddress: '1.1.1.1', queryParams: `?u=${invitingUserId}` },
    ]);
    mockPrismaClient.eventRSVP.findMany.mockResolvedValue([]);

    const { req, res } = mockRequestResponse('GET', { eventId: eventId.toString() });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result).toEqual([]); // No analytics data if user not found
  });
});
