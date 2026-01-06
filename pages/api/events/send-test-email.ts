import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { prisma } from 'utils/prisma/init';
import { sendEventReminder } from 'utils/email/send-event-reminder';
import { sendRsvpConfirmation } from 'utils/email/send-rsvp-confirmation';
import { sendInviterNotification } from 'utils/email/send-inviter-notification';

/**
 * API endpoint to send test emails for events
 * @param req - NextApiRequest
 * @param res - NextApiResponse
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if user has event management permissions
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { roles: true },
    });

    const hasEventManagement = user?.roles?.some(role => role.hasEventManagement);
    if (!hasEventManagement) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }

    // Get request body
    const { eventId, email, emailType } = req.body;

    if (!eventId || !email || !emailType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Get the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        location: true,
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Create a test RSVP object
    const testRsvp = {
      id: 999999, // Use a number for the ID to match PartialEventRSVP type
      status: 'Going' as const, // Cast to the enum type
      user: {
        id: user.id,
        email: email,
        name: user.name || 'Test User',
      },
      event: event,
    };

    let success = false;
    let message = '';

    // Send the appropriate test email
    switch (emailType) {
      case 'reminder':
        success = await sendEventReminder(testRsvp);
        message = success ? 'Reminder email sent successfully' : 'Failed to send reminder email';
        break;
      case 'rsvp':
        success = await sendRsvpConfirmation(testRsvp);
        message = success ? 'RSVP confirmation email sent successfully' : 'Failed to send RSVP confirmation email';
        break;
      case 'inviter':
        // For inviter notification, we need both the invitee and inviter
        success = await sendInviterNotification(
          testRsvp,
          {
            id: user.id,
            email: email,
            name: user.name || 'Test Inviter',
          },
          'This is a test comment for the inviter notification.',
        );
        message = success ? 'Inviter notification email sent successfully' : 'Failed to send inviter notification email';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid email type' });
    }

    return res.status(success ? 200 : 500).json({ success, message });
  } catch (error) {
    console.error('[send-test-email] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
