import fs from 'fs';
import path from 'path';
import { PartialEventRSVP, PartialUser, PartialEvent } from 'interfaces';
import formatTimeRange from 'utils/formatTimeRange';

/**
 * Converts a date to CST timezone
 * @param date - The date to convert
 * @returns Date object in CST timezone
 */
export const convertToCST = (date: string | Date): Date => {
  const dateObj = new Date(date);
  return new Date(dateObj.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

export const getReminderText = (event: PartialEventRSVP['event'], options: { reminderText?: string } = {}): string => {
  if (!event) return '';

  // Use options.reminderText if provided, then event.reminderText, then default text
  return (
    options.reminderText?.trim() ||
    event.reminderText?.trim() ||
    `We're excited to see you tomorrow at ${
      event.name || ''
    }.  It's your last chance to spread the word to save your friends, fam, and coworkers from missing out on a tree-mendous time!`
  );
};

/**
 * Formats a date in a human-readable format (e.g., "Sunday, June 15, 2025")
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago', // Format date in CST timezone
  });
};

/**
 * Generates a Google Calendar link for the event
 * @param event - The event details
 * @returns URL to add event to Google Calendar
 */
export const generateGoogleCalendarLink = (event: PartialEventRSVP['event']): string => {
  if (!event || !event.startDate) return '';

  // Create date objects from the event's startDate (using original UTC time)
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
 * Generates an iCalendar link for the event
 * @param event - The event details
 * @returns URL to download the iCal file
 */
export const generateICalendarLink = (event: PartialEventRSVP['event']): string => {
  // Return empty string if event is missing or required parameters are not present
  if (!event || !event.id) return '';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tfyp.org';

  // Use the new endpoint that fetches event data by ID
  return `${baseUrl}/api/events/${event.id}/ical`;
};

/**
 * Generates an invite link for the event
 * @param event - The event details
 * @param user - The user details
 * @returns URL to the event invite page
 */
export const generateInviteLink = (event: PartialEventRSVP['event'], user: PartialUser): string => {
  if (!event || !user) return '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tfyp.org';
  return `${baseUrl}/e/${event.path}/invite?u=${user.id}`;
};

/**
 * Generates an update RSVP link for the event
 * @param event - The event details
 * @param user - The user details
 * @returns URL to update RSVP status
 */
export const generateUpdateRsvpLink = (event: PartialEventRSVP['event'], user: PartialUser): string => {
  if (!event || !user || !user.email) return '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tfyp.org';
  return `${baseUrl}/e/${event.path}/invite?email=${encodeURIComponent(user.email)}`;
};

/**
 * Processes the email template by replacing placeholders with actual data
 * @param template - The email template HTML
 * @param eventRSVP - The event RSVP data
 * @param options - Additional options for template processing
 * @returns Processed HTML with placeholders replaced
 */
export const processTemplate = (
  template: string,
  eventRSVP: PartialEventRSVP,
  options: {
    isReminder?: boolean;
    heading?: string;
    reminderText?: string;
    fundraisingInfo?: {
      currentAmount: number;
      goalAmount: number;
    } | null;
  } = {},
): string => {
  const { event, user } = eventRSVP;
  const { isReminder = false, heading, fundraisingInfo } = options;

  if (!event || !user) {
    throw new Error('Event or user data is missing');
  }

  // Format dates for display in CST
  const formattedDate = event.startDate ? formatDate(new Date(event.startDate)) : 'Date TBD';
  const formattedTime =
    event.startDate && event.endDate
      ? formatTimeRange(convertToCST(event.startDate), convertToCST(event.endDate))
      : event.startDate
      ? formatTimeRange(convertToCST(event.startDate))
      : 'Time TBD';

  // Generate links
  const googleCalendarLink = generateGoogleCalendarLink(event);
  const iCalendarLink = generateICalendarLink(event);
  const inviteLink = generateInviteLink(event, user);
  const updateRsvpLink = generateUpdateRsvpLink(event, user);

  // Get the appropriate reminder text
  const reminderText = getReminderText(event, options);

  // Process the template based on whether it's a reminder or not
  let processedTemplate = template;

  if (isReminder) {
    // For reminders, keep the reminder section
    processedTemplate = processedTemplate.replace(/{{#isReminder}}/g, '');
    processedTemplate = processedTemplate.replace(/{{\/isReminder}}/g, '');
  } else {
    // For RSVP confirmations, remove the reminder section completely
    const reminderRegex = /{{#isReminder}}[\s\S]*?{{\/isReminder}}/g;
    processedTemplate = processedTemplate.replace(reminderRegex, '');
  }

  // Replace placeholders in the template
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
  processedTemplate = processedTemplate.replace(
    /{{heading}}/g,
    heading || (isReminder ? '⏰ Event Reminder!' : eventRSVP.status === 'Going' ? "🎉 You're RSVP'd!" : "🤔 You've RSVP'd Maybe!"),
  );
  processedTemplate = processedTemplate.replace(/{{reminderText}}/g, reminderText);

  // Links
  processedTemplate = processedTemplate.replace(/{{event.googleCalendarLink}}/g, googleCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.iCalendarLink}}/g, iCalendarLink);
  processedTemplate = processedTemplate.replace(/{{event.inviteLink}}/g, inviteLink);
  processedTemplate = processedTemplate.replace(/{{event.path}}/g, event.path || '');
  processedTemplate = processedTemplate.replace(/{{event.updateRsvpLink}}/g, updateRsvpLink);

  // User details
  processedTemplate = processedTemplate.replace(/{{user.email}}/g, user.email || '');

  // Fundraising information
  if (fundraisingInfo) {
    // Format currency values
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Replace fundraising placeholders
    processedTemplate = processedTemplate.replace(/{{#hasFundraisingGoal}}/g, '');
    processedTemplate = processedTemplate.replace(/{{\/hasFundraisingGoal}}/g, '');
    processedTemplate = processedTemplate.replace(/{{fundraising.currentAmount}}/g, formatCurrency(fundraisingInfo.currentAmount));
    processedTemplate = processedTemplate.replace(/{{fundraising.goalAmount}}/g, formatCurrency(fundraisingInfo.goalAmount));
    processedTemplate = processedTemplate.replace(
      /{{fundraising.percentComplete}}/g,
      Math.min(100, Math.round((fundraisingInfo.currentAmount / fundraisingInfo.goalAmount) * 100)).toString(),
    );

    // Generate donation link with user's email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tfyp.org';
    const donationLink = `${baseUrl}/e/${event.path}/invite?email=${encodeURIComponent(user.email || '')}&donate=true`;
    processedTemplate = processedTemplate.replace(/{{fundraising.donationLink}}/g, donationLink);
  } else {
    // Remove fundraising section if no goal
    const fundraisingRegex = /{{#hasFundraisingGoal}}[\s\S]*?{{\/hasFundraisingGoal}}/g;
    processedTemplate = processedTemplate.replace(fundraisingRegex, '');
  }

  return processedTemplate;
};

/**
 * Generates plain text content for the email
 * @param eventRSVP - The event RSVP data
 * @param options - Additional options for content generation
 * @returns Plain text content for the email
 */
export const generatePlainTextContent = (
  eventRSVP: PartialEventRSVP,
  options: {
    isReminder?: boolean;
    reminderText?: string;
    fundraisingInfo?: {
      currentAmount: number;
      goalAmount: number;
    } | null;
  } = {},
): string => {
  const { event, user } = eventRSVP;
  const { isReminder = false, fundraisingInfo } = options;

  if (!event || !user || !event.startDate) {
    return '';
  }

  // Get the appropriate reminder text
  const reminderText = getReminderText(event, options);

  let content = '';

  if (isReminder) {
    content = `Event Reminder: ${event.name}!\n\n${reminderText}\n\n`;
  } else {
    content = `You're RSVP'd for ${event.name}!\n\n`;
  }

  content += `Date & Time: ${formatDate(new Date(event.startDate))} ${formatTimeRange(
    convertToCST(event.startDate),
    event.endDate ? convertToCST(event.endDate) : undefined,
  )}
Location: ${event.location?.name} ${event.location?.address || ''}
Details: ${event.description || ''}

Add to Calendar:
Google: ${generateGoogleCalendarLink(event)}
iCal: ${generateICalendarLink(event)}

Invite Friends: ${generateInviteLink(event, user)}
Update your RSVP: ${generateUpdateRsvpLink(event, user)}`;

  // Add fundraising information to plain text if available
  if (fundraisingInfo) {
    const percentComplete = Math.min(100, Math.round((fundraisingInfo.currentAmount / fundraisingInfo.goalAmount) * 100));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tfyp.org';
    const donationLink = `${baseUrl}/e/${event.path}/invite?email=${encodeURIComponent(user.email || '')}&donate=true`;

    content += `\n\nFundraising Progress: $${fundraisingInfo.currentAmount} of $${fundraisingInfo.goalAmount} (${percentComplete}%)
Help us reach our goal by donating: ${donationLink}`;
  }

  return content;
};

/**
 * Reads the email template file
 * @returns The email template HTML content
 */
export const readEmailTemplate = (): string => {
  const templatePath = path.join(process.cwd(), 'event-email-template.html');
  return fs.readFileSync(templatePath, 'utf8');
};
