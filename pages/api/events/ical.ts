import { NextApiRequest, NextApiResponse } from 'next';
import xss from 'xss';

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
    // Extract event details from query parameters
    const { id, name, description, location, startDate, endDate } = req.query;

    // If an ID is provided, redirect to the new endpoint
    if (id) {
      console.log(`[DEPRECATED] Redirecting to new iCal endpoint for event ID: ${id}`);
      return res.redirect(307, `/api/events/${id}/ical`);
    }

    // For backward compatibility, continue with the old implementation
    // Validate required parameters
    if (!name || !startDate) {
      return res.status(400).json({ message: 'Missing required parameters: name and startDate are required' });
    }

    console.log('[DEPRECATED] Using legacy iCal endpoint without event ID');

    // Parse dates
    const start = new Date(startDate as string);

    // If event has an endDate, use it; otherwise, add 1.5 hours to startDate (same logic as in calendar functions)
    const end = endDate ? new Date(endDate as string) : new Date(start.getTime() + 90 * 60000); // 90 minutes in milliseconds

    // Format dates for iCalendar (YYYYMMDDTHHmmssZ format)
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    const now = formatDate(new Date());

    // Generate a unique identifier for the event
    const uid = `event-${id || Math.random().toString(36).substring(2, 11)}@tfyp.org`;

    // Format the event summary (name) according to iCalendar standards
    const formattedSummary = (name as string).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');

    // Format the location according to iCalendar standards if provided
    const formattedLocation = location
      ? (location as string).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
      : '';

    // Process the description with our HTML-to-text conversion function
    const formattedDescription = formatDescriptionForICalendar(description as string | undefined);

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
      description ? formattedDescription : '',
      location ? `LOCATION:${formattedLocation}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\r\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="event-${id || 'calendar'}.ics"`);

    // Return the iCalendar content
    return res.status(200).send(icalContent);
  } catch (error) {
    console.error('Error generating iCalendar file:', error);
    return res.status(500).json({ message: 'Error generating iCalendar file', error });
  }
}
