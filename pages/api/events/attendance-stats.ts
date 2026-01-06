import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';
import { EventStats } from 'interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all events with their check-ins and RSVPs
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            checkIns: true,
            RSVPs: true,
          },
        },
        RSVPs: {
          select: {
            status: true,
            userId: true,
          },
        },
        checkIns: {
          select: {
            userId: true,
            createdDate: true,
          },
        },
        location: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    // Get all event IDs for fetching subscriptions
    const eventIds = events.map(event => event.id);

    // Get all check-ins across all events to determine first-time check-ins
    const allCheckIns = await prisma.eventCheckIn.findMany({
      where: {
        eventId: {
          in: eventIds,
        },
      },
      select: {
        id: true,
        userId: true,
        eventId: true,
        createdDate: true,
      },
      orderBy: {
        createdDate: 'asc',
      },
    });

    // Create a map of user IDs to their first check-in event ID
    const userFirstCheckInMap = new Map<number, number>();

    // Populate the map with each user's first check-in event
    allCheckIns.forEach(checkIn => {
      if (checkIn.userId && !userFirstCheckInMap.has(checkIn.userId)) {
        userFirstCheckInMap.set(checkIn.userId, checkIn.eventId);
      }
    });

    // Get all subscriptions to check for new members
    const subscriptions = await prisma.subscriptionWithDetails.findMany({
      select: {
        id: true,
        createdDate: true,
      },
    });

    // Get all donations for events
    const donations = await prisma.donation.findMany({
      where: {
        eventId: {
          in: eventIds,
        },
        // Note: status field removed as it may not exist in the Donation model
      },
    });

    // Calculate donation amounts by event
    const donationsByEvent = donations.reduce((acc, donation) => {
      const eventId = donation.eventId;
      if (!acc[eventId]) {
        acc[eventId] = 0;
      }
      acc[eventId] += donation.amount ? parseFloat(donation.amount.toString()) : 0;
      return acc;
    }, {} as Record<number, number>);

    // Transform the data to include the stats we need
    const eventStats: EventStats[] = events.map(event => {
      // Count RSVPs by status
      const goingRsvpCount = event.RSVPs.filter(rsvp => rsvp.status === 'Going').length;

      const maybeRsvpCount = event.RSVPs.filter(rsvp => rsvp.status === 'Maybe').length;

      // Get unique user IDs who RSVPd (both Going and Maybe)
      const rsvpUserIds = event.RSVPs.filter(rsvp => rsvp.status === 'Going' || rsvp.status === 'Maybe')
        .map(rsvp => rsvp.userId)
        .filter((id): id is number => id !== null);

      // Get unique user IDs who checked in
      const checkInUserIds = event.checkIns.map(checkIn => checkIn.userId).filter((id): id is number => id !== null);

      // Count users who both RSVPd and checked in
      const rsvpCheckInCount = rsvpUserIds.filter(userId => checkInUserIds.includes(userId)).length;

      // Calculate new members for this event
      // A new member is someone whose subscription was created within 5 hours before or 24 hours after the event start
      const newMemberCount = event.startDate
        ? subscriptions.filter(subscription => {
            if (!subscription.createdDate) return false;

            const subscriptionDate = new Date(subscription.createdDate);
            const eventDate = new Date(event.startDate);

            // Calculate time difference in hours
            const hoursBefore = 5;
            const hoursAfter = 24;

            // Set time boundaries
            const lowerBound = new Date(eventDate);
            lowerBound.setHours(eventDate.getHours() - hoursBefore);

            const upperBound = new Date(eventDate);
            upperBound.setHours(eventDate.getHours() + hoursAfter);

            // Check if subscription date is within the time window
            return subscriptionDate >= lowerBound && subscriptionDate <= upperBound;
          }).length
        : 0;

      // Calculate first-time check-ins for this event
      const firstTimeCheckInCount = event.checkIns
        .filter(checkIn => checkIn.userId)
        .filter(checkIn => {
          // If this user's first check-in event ID matches this event's ID, it's a first-time check-in
          return checkIn.userId && userFirstCheckInMap.get(checkIn.userId) === event.id;
        }).length;

      return {
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        location: event.location,
        path: event.path,
        checkInCount: event._count.checkIns,
        goingRsvpCount,
        maybeRsvpCount,
        rsvpCheckInCount,
        newMemberCount,
        firstTimeCheckInCount,
        fundraisingGoal: event.fundraisingGoal,
        fundraisingAmount: donationsByEvent[event.id] || 0,
      };
    });

    // Sort by check-in count (descending)
    eventStats.sort((a, b) => b.checkInCount - a.checkInCount);

    return res.status(200).json(eventStats);
  } catch (error) {
    console.error('Error fetching event attendance stats:', error);
    return res.status(500).json({
      message: 'Error fetching event attendance stats',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
