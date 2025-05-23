import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PartialEventRSVP } from 'interfaces';
import sendEmail from 'utils/email/send-email';
import formatTimeRange from 'utils/formatTimeRange';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Formats a date in a human-readable format (e.g., "Sunday, June 15, 2025")
 * @param date - The date to format
 * @returns Formatted date string
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generates a Google Calendar link for the event
 * @param event - The event details
 * @returns URL to add event to Google Calendar
 */
const generateGoogleCalendarLink = (event: PartialEventRSVP['event']): string => {
  if (!event || !event.startDate) return '';

  // Create date objects from the event's startDate
  const startDate = new Date(event.startDate);

  // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000);

  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ format without dashes or colons)
  const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.name || '',
  )}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(
    event.location?.name || '',
  )}`;
};

/**
 * Generates an Outlook Calendar link for the event
 * @param event - The event details
 * @returns URL to add event to Outlook Calendar
 */
const generateOutlookCalendarLink = (event: PartialEventRSVP['event']): string => {
  if (!event || !event.startDate) return '';

  // Create date objects from the event's startDate
  const startDate = new Date(event.startDate);

  // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000);

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    event.name || '',
  )}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(
    event.description || '',
  )}&location=${encodeURIComponent(event.location?.name || '')}`;
};

/**
 * Generates a Yahoo Calendar link for the event
 * @param event - The event details
 * @returns URL to add event to Yahoo Calendar
 */
const generateYahooCalendarLink = (event: PartialEventRSVP['event']): string => {
  if (!event || !event.startDate) return '';

  // Create date objects from the event's startDate
  const startDate = new Date(event.startDate);

  // If event has an endDate, use it; otherwise, add 1.5 hours to startDate
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000);

  // Format dates for Yahoo Calendar (YYYYMMDDTHHmmssZ format without dashes or colons)
  const yahooStartDate = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const yahooEndDate = endDate.toISOString().replace(/-|:|\.\d+/g, '');

  return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
    event.name || '',
  )}&st=${yahooStartDate}&et=${yahooEndDate}&desc=${encodeURIComponent(event.description || '')}&in_loc=${encodeURIComponent(
    event.location?.name || '',
  )}`;
};

/**
 * Generates an iCalendar link for the event
 * @param event - The event details
 * @returns URL to download the iCal file
 */
const generateICalendarLink = (event: PartialEventRSVP['event']): string => {
  // Return empty string if event is missing or required parameters are not present
  if (!event || !event.name || !event.startDate) return '';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org';
  // Format dates for iCalendar
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 90 * 60000);

  const params = new URLSearchParams({
    id: event.id?.toString() || '',
    name: event.name || '',
    description: event.description || '',
    location: event.location?.name || '',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  return `${baseUrl}/api/events/ical?${params.toString()}`;
};

/**
 * Generates an invite link for the event
 * @param event - The event details
 * @returns URL to the event invite page
 */
const generateInviteLink = (event: PartialEventRSVP['event'], user: PartialEventRSVP['user']): string => {
  if (!event || !user) return '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org';
  return `${baseUrl}/e/${event.path}/invite?u=${user.id}`;
};

/**
 * Replaces placeholders in the email template with actual data
 * @param template - The email template HTML
 * @param eventRSVP - The event RSVP data
 * @returns Processed HTML with placeholders replaced
 */
const processTemplate = (template: string, eventRSVP: PartialEventRSVP): string => {
  const { event, user } = eventRSVP;

  if (!event || !user) {
    throw new Error('Event or user data is missing');
  }

  // Format dates for display
  const formattedDate = event.startDate ? formatDate(new Date(event.startDate)) : 'Date TBD';
  const formattedTime =
    event.startDate && event.endDate
      ? formatTimeRange(event.startDate, event.endDate)
      : event.startDate
      ? formatTimeRange(event.startDate)
      : 'Time TBD';

  // Generate links
  const googleCalendarLink = generateGoogleCalendarLink(event);
  const outlookCalendarLink = generateOutlookCalendarLink(event);
  const yahooCalendarLink = generateYahooCalendarLink(event);
  const iCalendarLink = generateICalendarLink(event);
  const inviteLink = generateInviteLink(event, user);
  const updateRsvpLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org'}/e/${event.path}/invite?email=${encodeURIComponent(
    user.email || '',
  )}`;

  // Default reminder text if none is provided
  const defaultReminderText = `We're excited to see you tomorrow at ${event.name}! Don't forget to bring your enthusiasm and energy!`;

  // Use custom reminder text if available, otherwise use default
  const reminderText = event.reminderText || defaultReminderText;

  // Replace placeholders in the template
  let processedTemplate = template;

  // Schema.org event data for calendar integration
  processedTemplate = processedTemplate.replace(/{{event.name}}/g, event.name || '');
  processedTemplate = processedTemplate.replace(/{{event.startDate}}/g, event.startDate ? new Date(event.startDate).toISOString() : '');
  processedTemplate = processedTemplate.replace(/{{event.endDate}}/g, event.endDate ? new Date(event.endDate).toISOString() : '');
  processedTemplate = processedTemplate.replace(/{{event.location.name}}/g, event.location?.name || '');
  processedTemplate = processedTemplate.replace(/{{event.location.address}}/g, event.location?.address || '');
  processedTemplate = processedTemplate.replace(/{{event.description}}/g, event.description || '');

  // Event details
  processedTemplate = processedTemplate.replace(/{{event.formattedDate}}/g, formattedDate);
  processedTemplate = processedTemplate.replace(/{{event.formattedTime}}/g, formattedTime);
  processedTemplate = processedTemplate.replace(/{{event.pictureUrl}}/g, event.pictureUrl || '');
  processedTemplate = processedTemplate.replace(/{{heading}}/g, '⏰ Event Reminder!');
  processedTemplate = processedTemplate.replace(/{{reminderText}}/g, reminderText);

  // Links
  processedTemplate = processedTemplate.replace(/{{event.googleCalendarLink}}/g, googleCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.outlookCalendarLink}}/g, outlookCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.yahooCalendarLink}}/g, yahooCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.iCalendarLink}}/g, iCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.inviteLink}}/g, inviteLink);
  processedTemplate = processedTemplate.replace(/{{event.path}}/g, event.path || '');
  processedTemplate = processedTemplate.replace(/{{event.updateRsvpLink}}/g, updateRsvpLink);

  // User details
  processedTemplate = processedTemplate.replace(/{{user.email}}/g, user.email || '');

  return processedTemplate;
};

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
    const templatePath = path.join(process.cwd(), 'event-email-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Process the template with event data and set isReminder to true
    let processedTemplate = template.replace(/{{#isReminder}}/g, '');
    processedTemplate = processedTemplate.replace(/{{\/isReminder}}/g, '');

    const emailHtml = processTemplate(processedTemplate, eventRSVP);

    // Default reminder text if none is provided
    const defaultReminderText = `We're excited to see you tomorrow at ${event.name}! Don't forget to bring your enthusiasm and energy!`;

    // Use custom reminder text if available, otherwise use default
    const reminderText = event.reminderText || defaultReminderText;

    // Create a plain text version (simplified)
    const plainText = `Event Reminder: ${event.name}!

${reminderText}

Date & Time: ${formatDate(new Date(event.startDate))} ${formatTimeRange(event.startDate, event.endDate)}
Location: ${event.location?.name} ${event.location?.address || ''}
Details: ${event.description || ''}

Add to Calendar:
Google: ${generateGoogleCalendarLink(event)}
Outlook: ${generateOutlookCalendarLink(event)}
Yahoo: ${generateYahooCalendarLink(event)}
iCal: ${generateICalendarLink(event)}

Invite Friends: ${generateInviteLink(event, user)}
Update your RSVP: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org'}/e/${event.path}/invite?email=${user.email}`;

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
