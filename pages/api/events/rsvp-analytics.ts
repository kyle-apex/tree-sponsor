import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';

interface UserAnalytics {
  userId: number;
  userName: string | null;
  userImage: string | null;
  uniquePageViews: number;
  totalRSVPs: number;
  rsvpsByStatus: {
    going: number;
    maybe: number;
    declined: number;
    invited: number;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get eventId from query parameters
    const eventId = req.query.eventId ? Number(req.query.eventId) : null;

    if (!eventId) {
      return res.status(400).json({ message: 'Missing required query parameter: eventId' });
    }

    // Fetch the event to get its path
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { path: true },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Construct the invite page URL pattern
    const invitePageUrl = `/e/${event.path}/invite`;

    // Use a raw query to get page views since the Prisma client doesn't have the PageView model
    console.log(`Searching for page views with URL: ${invitePageUrl}`);

    // Refined raw query to ensure we get all necessary fields and proper joins
    const pageViewsRaw = await prisma.$queryRaw`
      SELECT DISTINCT pv.visitorId, pv.queryParams, pv.ipAddress
      FROM PageView pv
      WHERE pv.pageUrl = ${invitePageUrl}
      AND pv.queryParams LIKE '%u=%'
    `;

    const pageViewCount = Array.isArray(pageViewsRaw) ? pageViewsRaw.length : 0;
    console.log(`Found ${pageViewCount} page views for event ${eventId}`);

    if (pageViewCount === 0) {
      console.log(`No page views found for invite URL: ${invitePageUrl}`);
      console.log(`This could be because no one has visited the invite page with a referral parameter.`);
    }

    // Extract user IDs from the 'u' query parameter in page views
    const userAnalyticsMap = new Map<number, UserAnalytics>();

    // Track unique visitors by IP address for each inviting user
    const userVisitorMap = new Map<number, Set<string>>();

    // Process page views to extract inviting users
    for (const view of pageViewsRaw as any[]) {
      if (!view.queryParams) continue;

      // Extract the u parameter using regex since URLSearchParams is not available in Node.js
      const uMatch = view.queryParams.match(/[?&]*u=([^&]*)/);
      const invitingUserId = uMatch ? uMatch[1] : null;

      if (!invitingUserId) {
        console.log(`No inviting user ID found in query params: ${view.queryParams}`);
        console.log(`The query parameter should contain "u=<userId>" to track invitations.`);
        continue;
      }

      const userId = Number(invitingUserId);

      if (isNaN(userId)) {
        console.log(`Invalid user ID (not a number): ${invitingUserId}`);
        console.log(`The user ID must be a valid number. This page view will be skipped.`);
        continue;
      }

      console.log(`Processing page view with inviting user ID: ${userId}`);

      // Get or initialize user analytics
      if (!userAnalyticsMap.has(userId)) {
        // Find the user to get their name and image
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, image: true },
        });

        if (!user) {
          console.log(`User with ID ${userId} not found in database`);
          console.log(`This could be because the user was deleted or the ID is invalid.`);
          continue;
        }

        console.log(`Found user: ${user.name || 'Unnamed User'} (ID: ${userId})`);

        userAnalyticsMap.set(userId, {
          userId,
          userName: user?.name || null,
          userImage: user?.image || null,
          uniquePageViews: 0,
          totalRSVPs: 0,
          rsvpsByStatus: {
            going: 0,
            maybe: 0,
            declined: 0,
            invited: 0,
          },
        });

        // Initialize the set of unique visitors for this user
        userVisitorMap.set(userId, new Set<string>());
      }

      // Create a unique visitor identifier based on visitorId and ipAddress
      // If ipAddress is available, use it as the primary identifier to deduplicate
      // Otherwise, fall back to visitorId
      const visitorKey = view.ipAddress ? `ip:${view.ipAddress}` : `visitor:${view.visitorId}`;

      const visitorSet = userVisitorMap.get(userId)!;

      // Only count this as a unique page view if we haven't seen this visitor before
      if (!visitorSet.has(visitorKey)) {
        visitorSet.add(visitorKey);

        // Increment unique page views
        const analytics = userAnalyticsMap.get(userId)!;
        analytics.uniquePageViews++;
      }
    }

    // Get all user IDs from the analytics map
    const userIds = Array.from(userAnalyticsMap.keys());

    // Fetch RSVPs for these users
    const rsvps = await prisma.eventRSVP.findMany({
      where: {
        eventId,
        invitedByUserId: {
          in: userIds.length > 0 ? userIds : [-1], // Avoid empty IN clause
        },
      },
      select: {
        invitedByUserId: true,
        status: true,
      },
    });

    console.log(`Found ${rsvps.length} RSVPs for event ${eventId} created by tracked users`);

    if (rsvps.length === 0 && userIds.length > 0) {
      console.log(`No RSVPs found for users who invited others. This could mean:`);
      console.log(`1. Invitees haven't responded to invitations yet`);
      console.log(`2. The invitations were sent but not through the tracked invite link`);
    }

    // Update RSVP counts for each user
    for (const rsvp of rsvps) {
      if (!rsvp.invitedByUserId) continue;

      const analytics = userAnalyticsMap.get(rsvp.invitedByUserId);
      if (!analytics) continue;

      analytics.totalRSVPs++;

      // Update status counts based on the status string
      // Convert status to lowercase for case-insensitive comparison
      const status = rsvp.status?.toString() || '';
      const statusLower = status.toLowerCase();
      console.log(`Processing RSVP with status: ${status} for user ${rsvp.invitedByUserId}`);

      // Use lowercase comparison for case-insensitivity
      switch (statusLower) {
        case 'going':
          analytics.rsvpsByStatus.going++;
          break;
        case 'maybe':
          analytics.rsvpsByStatus.maybe++;
          break;
        case 'declined':
          analytics.rsvpsByStatus.declined++;
          break;
        case 'invited':
          analytics.rsvpsByStatus.invited++;
          break;
        default:
          console.log(`Unknown RSVP status: ${status} (converted to: ${statusLower})`);
          console.log(`Valid statuses are: Going, Maybe, Declined, Invited (case-insensitive)`);
      }
    }

    // Convert map to array and sort by total RSVPs (descending)
    const userAnalytics = Array.from(userAnalyticsMap.values()).sort((a, b) => b.totalRSVPs - a.totalRSVPs);

    console.log(`Returning analytics for ${userAnalytics.length} users`);

    // If no results, return an empty array with detailed diagnostic messages
    if (userAnalytics.length === 0) {
      console.log('No analytics data found. This could be due to:');
      console.log('1. No page views with "u=" parameter for this event');
      console.log('2. No RSVPs created by users who invited others');
      console.log('3. Invalid user IDs in the page view query parameters');
      console.log('4. Users referenced in page views may have been deleted');
      console.log(`Event ID: ${eventId}, Event Path: ${event.path}`);
      console.log(`Invite URL pattern being searched: ${invitePageUrl}`);
    } else {
      console.log(`Analytics data processed successfully for ${userAnalytics.length} users`);
      console.log(`Top inviter: ${userAnalytics[0].userName || 'Unknown'} with ${userAnalytics[0].totalRSVPs} RSVPs`);
    }

    return res.status(200).json(userAnalytics);
  } catch (error) {
    console.error('Error fetching RSVP analytics:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Request query parameters:', req.query);
    return res.status(500).json({ message: 'Error fetching RSVP analytics', error });
  }
}
