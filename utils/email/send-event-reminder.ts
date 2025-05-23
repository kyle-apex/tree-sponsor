import { PrismaClient } from '@prisma/client';
import { PartialEventRSVP } from 'interfaces';
import sendEmail from 'utils/email/send-email';
import * as EmailUtils from 'utils/email/email-utils';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Sends an event reminder email
 * @param eventRSVP - The event RSVP data containing both event and user details
 * @returns Promise that resolves to a boolean indicating success or failure
 */
const sendEventReminder = async (eventRSVP: PartialEventRSVP): Promise<boolean> => {
  try {
    const { event, user } = eventRSVP;

    if (!event || !user || !user.email) {
      console.error('[sendEventReminder] Missing required data:', { event, user });
      return false;
    }

    // Read the email template
    const template = EmailUtils.readEmailTemplate();

    // Process the template (with isReminder set to true)
    const emailHtml = EmailUtils.processTemplate(template, eventRSVP, {
      isReminder: true,
      heading: '⏰ Event Reminder!',
      reminderText: event.reminderText,
    });

    // Generate plain text content
    const plainText = EmailUtils.generatePlainTextContent(eventRSVP, {
      isReminder: true,
      reminderText: event.reminderText,
    });

    // Set the subject line
    const subject = `⏰ Reminder: ${event.name} is tomorrow!`;

    // Send the email
    const result = await sendEmail([user.email], subject, plainText, emailHtml);

    // If email was sent successfully, update the RSVP record to mark reminder as sent
    if (result && eventRSVP.id) {
      // Use raw SQL to update since the field might not be recognized by TypeScript yet
      await prisma.$executeRaw`UPDATE EventRSVP SET reminderSentAt = NOW() WHERE id = ${eventRSVP.id}`;
    }

    return result;
  } catch (error) {
    console.error('[sendEventReminder] Error sending event reminder email:', error);
    return false;
  }
};

/**
 * Finds events that are happening in approximately 24 hours and sends reminder emails
 * to users who have RSVP'd with 'Going' or 'Maybe' status
 * @returns Promise that resolves when all reminders have been processed
 */
const processEventReminders = async (): Promise<void> => {
  try {
    // Calculate the date range for events happening in ~24 hours
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyFiveHoursFromNow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Find events happening in approximately 24 hours
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startDate: {
          gte: twentyFourHoursFromNow,
          lt: twentyFiveHoursFromNow,
        },
      },
      include: {
        location: true,
      },
    });

    console.log(`[processEventReminders] Found ${upcomingEvents.length} events happening in ~24 hours`);

    // Process each event
    for (const event of upcomingEvents) {
      // Use raw SQL query to find RSVPs that haven't received a reminder
      // This avoids TypeScript errors with the new reminderSentAt field
      const rsvps = await prisma.$queryRaw`
        SELECT r.id, r.status, u.id as userId, u.name, u.email
        FROM EventRSVP r
        JOIN users u ON r.userId = u.id
        WHERE r.eventId = ${event.id}
        AND r.status IN ('Going', 'Maybe')
        AND (r.reminderSentAt IS NULL)
      `;

      console.log(
        `[processEventReminders] Found ${Array.isArray(rsvps) ? rsvps.length : 0} RSVPs to send reminders for event: ${event.name}`,
      );

      // Send reminder emails to each RSVP
      for (const rsvp of rsvps as any[]) {
        // Create a PartialEventRSVP object
        const eventRSVP: PartialEventRSVP = {
          id: rsvp.id,
          status: rsvp.status,
          // Create user object from the raw query results
          user: {
            id: rsvp.userId,
            email: rsvp.email,
            name: rsvp.name,
          },
          event: {
            ...event,
            location: event.location,
          },
        };

        // Send the reminder email
        const result = await sendEventReminder(eventRSVP);
        console.log(`[processEventReminders] Reminder email ${result ? 'sent' : 'failed'} for user: ${rsvp.email}`);
      }
    }
  } catch (error) {
    console.error('[processEventReminders] Error processing event reminders:', error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
};

export { sendEventReminder, processEventReminders };
