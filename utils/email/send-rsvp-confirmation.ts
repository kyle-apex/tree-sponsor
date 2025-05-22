import fs from 'fs';
import path from 'path';
import { PartialEventRSVP, PartialUser } from 'interfaces';
import sendEmail from 'utils/email/send-email';
import formatTimeRange from 'utils/formatTimeRange';
import { prisma } from 'utils/prisma/init';

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
const generateInviteLink = (event: PartialEventRSVP['event'], user: PartialUser): string => {
  if (!event) return '';
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
  processedTemplate = processedTemplate.replace(/{{event.pictureUrl}}/g, event.pictureUrl);
  processedTemplate = processedTemplate.replace(
    /{{heading}}/g,
    eventRSVP.status === 'Going' ? "🎉 You're RSVP'd!" : "🤔 You've RSVP'd Maybe!",
  );
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
 * Schedules sending an RSVP confirmation email after a delay
 * @param eventRSVP - The event RSVP data containing both event and user details
 * @param delayMs - Delay in milliseconds before sending the email (default: 2 minutes),
 * @returns Promise that resolves when the email is scheduled
 */
const scheduleSendRsvpConfirmation = async (
  eventRSVP: PartialEventRSVP,
  delayMs = 1 * 10 * 1000, // 2 minutes by default
): Promise<void> => {
  // Schedule the email to be sent after the delay
  setTimeout(async () => {
    if (eventRSVP?.id) {
      const currentRSVP = await prisma.eventRSVP.findFirst({ where: { id: eventRSVP.id } });
      // Check if the RSVP status has changed to avoid sending an email for an earlier status
      if (currentRSVP?.status !== eventRSVP.status) {
        return;
      }
    }

    sendRsvpConfirmation(eventRSVP).catch(error => {
      console.error('[scheduleSendRsvpConfirmation] Error sending RSVP confirmation email:', error);
    });
  }, delayMs);
};

/**
 * Sends an RSVP confirmation email
 * @param eventRSVP - The event RSVP data containing both event and user details
 * @returns Promise that resolves when the email is sent
 */
const sendRsvpConfirmation = async (eventRSVP: PartialEventRSVP): Promise<boolean> => {
  try {
    const { event, user } = eventRSVP;

    if (!event || !user || !user.email) {
      console.error('[sendRsvpConfirmation] Missing required data:', { event, user });
      return false;
    }

    // Read the email template
    const templatePath = path.join(process.cwd(), 'rsvp-confirmation-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Process the template with event data
    const emailHtml = processTemplate(template, eventRSVP);

    // Create a plain text version (simplified)
    const plainText = `You're RSVP'd for ${event.name}!
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
    const subject = `${eventRSVP.status === 'Going' ? "🎉 You're RSVP'd" : "🤔 You've RSVP'd Maybe!"}: ${event.name}`;

    // Generate preview text based on RSVP status
    const previewText =
      eventRSVP.status === 'Going'
        ? `Get ready for an amazing time at ${event.name}. Share with your crew for an even better time!`
        : `Thanks for letting us know you might join us at ${event.name}. We hope to see you there!`;

    // Send the email
    return await sendEmail([user.email], subject, plainText, emailHtml, 'TreeFolks Young Professionals', previewText);
  } catch (error) {
    console.error('[sendRsvpConfirmation] Error sending RSVP confirmation email:', error);

    return false;
  }
};

export { sendRsvpConfirmation, scheduleSendRsvpConfirmation };
