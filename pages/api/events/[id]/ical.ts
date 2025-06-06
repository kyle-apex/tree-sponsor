import { NextApiRequest, NextApiResponse } from 'next';
import xss from 'xss';
import { prisma } from 'utils/prisma/init';

/**
 * Converts HTML to plain text and formats it according to iCalendar standards
 *
 * @param html HTML content to convert
 * @returns Formatted plain text suitable for iCalendar DESCRIPTION field
 */
function formatDescriptionForICalendar(html: string | null | undefined): string {
  if (!html) return '';

  // Step 1: Sanitize HTML to prevent XSS (this also helps with HTML parsing)
  const sanitizedHtml = xss(html, {
    whiteList: {}, // No tags allowed (strip all HTML)
    stripIgnoreTag: true, // Strip the content of ignored tags
    css: false,
  });

  // Step 2: Convert HTML entities to their corresponding characters
  const decodedText = sanitizedHtml
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&bull;/g, '•')
    .replace(/&hellip;/g, '...')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');

  // Step 3: Escape special characters according to iCalendar spec (RFC 5545)
  // Backslashes, commas, and semicolons need to be escaped
  let escapedText = decodedText.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;');

  // Step 4: Replace newlines with the proper iCalendar line break
  escapedText = escapedText.replace(/\r\n|\r|\n/g, '\\n');

  // Step 5: Implement line folding according to iCalendar spec
  // Lines longer than 75 characters should be folded
  const MAX_LINE_LENGTH = 75;
  let foldedText = '';
  let currentLine = 'DESCRIPTION:';

  for (let i = 0; i < escapedText.length; i++) {
    const char = escapedText[i];

    if (currentLine.length >= MAX_LINE_LENGTH) {
      foldedText += currentLine + '\r\n '; // Fold line with space at beginning of next line
      currentLine = '';
    }

    currentLine += char;
  }

  if (currentLine.length > 0) {
    foldedText += currentLine;
  }

  return foldedText;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract event ID from the path parameter
    const eventId = Number(req.query.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    // Fetch event data from the database
    const event = await prisma.event.findFirst({
      where: { id: eventId },
      include: {
        location: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate required parameters
    if (!event.name || !event.startDate) {
      return res.status(400).json({ message: 'Event is missing required data: name and startDate are required' });
    }

    // Parse dates
    const start = new Date(event.startDate);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate (same logic as in calendar functions)
    const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 90 * 60000); // 90 minutes in milliseconds

    // Format dates for iCalendar (YYYYMMDDTHHmmssZ format)
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    const now = formatDate(new Date());

    // Generate a unique identifier for the event
    const uid = `event-${eventId}@tfyp.org`;

    // Format the event summary (name) according to iCalendar standards
    const formattedSummary = event.name.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

    // Format the location according to iCalendar standards if provided
    const formattedLocation = event.location?.name
      ? event.location.name.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
      : '';

    // Process the description with our HTML-to-text conversion function
    const formattedDescription = formatDescriptionForICalendar(event.description);

    // Create the iCalendar content
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TreeFolks//NONSGML Event Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:${formattedSummary}`,
      event.description ? formattedDescription : '',
      event.location?.name ? `LOCATION:${formattedLocation}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\r\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="event-${eventId}.ics"`);

    // Return the iCalendar content
    return res.status(200).send(icalContent);
  } catch (error) {
    console.error('Error generating iCalendar file:', error);
    return res.status(500).json({ message: 'Error generating iCalendar file', error });
  }
}
