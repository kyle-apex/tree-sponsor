import fs from 'fs';
import path from 'path';
import {
  getReminderText,
  formatDate,
  generateGoogleCalendarLink,
  generateICalendarLink,
  generateInviteLink,
  generateUpdateRsvpLink,
  processTemplate,
  generatePlainTextContent,
  readEmailTemplate,
} from '../../../utils/email/email-utils';
import formatTimeRange from '../../../utils/formatTimeRange';
import { PartialEvent, PartialEventRSVP, PartialUser } from '../../../interfaces';

// Mock the fs and path modules
jest.mock('fs');
jest.mock('path');

// Mock the formatTimeRange function
jest.mock('../../../utils/formatTimeRange', () => {
  return jest.fn().mockImplementation((_start, end) => {
    if (!end) return '10:00 AM';
    return '10:00 AM - 11:30 AM';
  });
});

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  process.env.NEXT_PUBLIC_BASE_URL = 'https://www.tfyp.org';
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

describe('Email Utilities', () => {
  // Sample data for testing
  const mockUser: PartialUser = {
    id: 123,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockLocation = {
    name: 'Test Location',
    address: '123 Test St, Austin, TX',
  };

  const mockEvent: PartialEvent = {
    id: 456,
    name: 'Test Event',
    description: 'This is a test event',
    startDate: new Date('2025-06-15T15:00:00.000Z'), // 10:00 AM CST
    endDate: new Date('2025-06-15T16:30:00.000Z'), // 11:30 AM CST
    path: 'test-event',
    location: mockLocation,
    reminderText: 'Custom reminder text for the event',
  };

  const mockEventRSVP: PartialEventRSVP = {
    id: 789,
    status: 'Going',
    event: mockEvent,
    user: mockUser,
  };

  describe('getReminderText', () => {
    test('should return empty string if event is not provided', () => {
      const result = getReminderText(undefined);
      expect(result).toBe('');
    });

    test('should use options.reminderText if provided', () => {
      const customText = 'Custom reminder from options';
      const result = getReminderText(mockEvent, { reminderText: customText });
      expect(result).toBe(customText);
    });

    test('should use event.reminderText if options.reminderText is not provided', () => {
      const result = getReminderText(mockEvent);
      expect(result).toBe(mockEvent.reminderText);
    });

    test('should use default text if neither options.reminderText nor event.reminderText is provided', () => {
      const eventWithoutReminderText: PartialEvent = { ...mockEvent, reminderText: undefined };
      const result = getReminderText(eventWithoutReminderText);
      expect(result).toContain(`We're excited to see you tomorrow at ${mockEvent.name}`);
    });
  });

  describe('formatDate', () => {
    test('should format a date in a human-readable format', () => {
      const date = new Date('2025-06-15T15:00:00.000Z');
      const result = formatDate(date);
      // The exact format will depend on the locale and timezone, but we can check for parts
      expect(result).toContain('2025');
      expect(typeof result).toBe('string');
    });
  });

  describe('generateGoogleCalendarLink', () => {
    test('should return empty string if event is not provided', () => {
      const result = generateGoogleCalendarLink(undefined);
      expect(result).toBe('');
    });

    test('should return empty string if event.startDate is not provided', () => {
      const result = generateGoogleCalendarLink({ ...mockEvent, startDate: undefined });
      expect(result).toBe('');
    });

    test('should generate a Google Calendar link with correct parameters', () => {
      const result = generateGoogleCalendarLink(mockEvent);
      expect(result).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
      expect(result).toContain(`text=${encodeURIComponent(mockEvent.name)}`);
      expect(result).toContain('dates=');
      expect(result).toContain(`details=${encodeURIComponent(mockEvent.description)}`);
      expect(result).toContain(`location=${encodeURIComponent(mockEvent.location.name)}`);
    });

    test('should handle event without endDate by adding 1.5 hours to startDate', () => {
      const eventWithoutEndDate: PartialEvent = { ...mockEvent, endDate: undefined };
      const result = generateGoogleCalendarLink(eventWithoutEndDate);
      expect(result).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
      expect(result).toContain('dates=');
    });
  });

  describe('generateICalendarLink', () => {
    test('should return empty string if event is not provided', () => {
      const result = generateICalendarLink(undefined);
      expect(result).toBe('');
    });

    test('should return empty string if event.id is not provided', () => {
      const result = generateICalendarLink({ ...mockEvent, id: undefined });
      expect(result).toBe('');
    });

    test('should generate an iCalendar link with the event ID in the path', () => {
      const result = generateICalendarLink(mockEvent);
      expect(result).toBe(`https://www.tfyp.org/api/events/${mockEvent.id}/ical`);
    });

    test('should use process.env.NEXT_PUBLIC_BASE_URL for the base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://custom-domain.com';
      const result = generateICalendarLink(mockEvent);
      expect(result).toBe(`https://custom-domain.com/api/events/${mockEvent.id}/ical`);
    });
  });

  describe('generateInviteLink', () => {
    test('should return empty string if event or user is not provided', () => {
      const result1 = generateInviteLink(undefined, mockUser);
      const result2 = generateInviteLink(mockEvent, undefined);
      expect(result1).toBe('');
      expect(result2).toBe('');
    });

    test('should generate an invite link with correct parameters', () => {
      const result = generateInviteLink(mockEvent, mockUser);
      expect(result).toBe(`https://www.tfyp.org/e/${mockEvent.path}/invite?u=${mockUser.id}`);
    });

    test('should use process.env.NEXT_PUBLIC_BASE_URL for the base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://custom-domain.com';
      const result = generateInviteLink(mockEvent, mockUser);
      expect(result).toBe(`https://custom-domain.com/e/${mockEvent.path}/invite?u=${mockUser.id}`);
    });
  });

  describe('generateUpdateRsvpLink', () => {
    test('should return empty string if event or user is not provided', () => {
      const result1 = generateUpdateRsvpLink(undefined, mockUser);
      const result2 = generateUpdateRsvpLink(mockEvent, undefined);
      expect(result1).toBe('');
      expect(result2).toBe('');
    });

    test('should return empty string if user.email is not provided', () => {
      const result = generateUpdateRsvpLink(mockEvent, { ...mockUser, email: undefined });
      expect(result).toBe('');
    });

    test('should generate an update RSVP link with correct parameters', () => {
      const result = generateUpdateRsvpLink(mockEvent, mockUser);
      expect(result).toBe(`https://www.tfyp.org/e/${mockEvent.path}/invite?email=${encodeURIComponent(mockUser.email)}`);
    });

    test('should use process.env.NEXT_PUBLIC_BASE_URL for the base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://custom-domain.com';
      const result = generateUpdateRsvpLink(mockEvent, mockUser);
      expect(result).toBe(`https://custom-domain.com/e/${mockEvent.path}/invite?email=${encodeURIComponent(mockUser.email)}`);
    });
  });

  describe('processTemplate', () => {
    const mockTemplate = `
      <html>
        <body>
          <h1>{{heading}}</h1>
          <p>{{event.name}}</p>
          <p>{{event.formattedDate}}, {{event.formattedTime}}</p>
          <p>{{event.location.name}}, {{event.location.address}}</p>
          <p>{{event.description}}</p>
          <p>{{user.email}}</p>
          <a href="{{event.googleCalendarLink}}">Google Calendar</a>
          <a href="{{event.iCalendarLink}}">iCal</a>
          <a href="{{event.inviteLink}}">Invite Friends</a>
          <a href="{{event.updateRsvpLink}}">Update RSVP</a>
          {{#isReminder}}
          <p>Reminder: {{reminderText}}</p>
          {{/isReminder}}
        </body>
      </html>
    `;

    test('should throw an error if event or user is missing', () => {
      expect(() => {
        processTemplate(mockTemplate, { ...mockEventRSVP, event: undefined });
      }).toThrow('Event or user data is missing');

      expect(() => {
        processTemplate(mockTemplate, { ...mockEventRSVP, user: undefined });
      }).toThrow('Event or user data is missing');
    });

    test('should process the template with event and user data', () => {
      const result = processTemplate(mockTemplate, mockEventRSVP);

      // Check that placeholders are replaced
      expect(result).toContain(mockEvent.name);
      expect(result).toContain(mockEvent.description);
      expect(result).toContain(mockEvent.location.name);
      expect(result).toContain(mockEvent.location.address);
      expect(result).toContain(mockUser.email);

      // Check that links are generated
      expect(result).toContain('https://calendar.google.com/calendar/render');
      expect(result).toContain(`https://www.tfyp.org/api/events/${mockEvent.id}/ical`);
      expect(result).toContain(`https://www.tfyp.org/e/${mockEvent.path}/invite?u=${mockUser.id}`);
      expect(result).toContain(`https://www.tfyp.org/e/${mockEvent.path}/invite?email=${encodeURIComponent(mockUser.email)}`);

      // Check that reminder section is removed for non-reminder emails
      expect(result).not.toContain('Reminder:');
    });

    test('should keep reminder section for reminder emails', () => {
      const result = processTemplate(mockTemplate, mockEventRSVP, { isReminder: true });
      expect(result).toContain('Reminder:');
      expect(result).toContain(mockEvent.reminderText);
    });

    test('should use custom heading if provided', () => {
      const customHeading = 'Custom Heading';
      const result = processTemplate(mockTemplate, mockEventRSVP, { heading: customHeading });
      expect(result).toContain(customHeading);
    });

    test('should use default heading based on RSVP status if not provided', () => {
      const result = processTemplate(mockTemplate, mockEventRSVP);
      expect(result).toContain("🎉 You're RSVP'd!");

      const maybeResult = processTemplate(mockTemplate, { ...mockEventRSVP, status: 'Maybe' });
      expect(maybeResult).toContain("🤔 You've RSVP'd Maybe!");
    });

    test('should use reminder heading for reminder emails if custom heading not provided', () => {
      const result = processTemplate(mockTemplate, mockEventRSVP, { isReminder: true });
      expect(result).toContain('⏰ Event Reminder!');
    });
  });

  describe('generatePlainTextContent', () => {
    test('should return empty string if event, user, or event.startDate is missing', () => {
      const result1 = generatePlainTextContent({ ...mockEventRSVP, event: undefined });
      const result2 = generatePlainTextContent({ ...mockEventRSVP, user: undefined });
      const result3 = generatePlainTextContent({
        ...mockEventRSVP,
        event: { ...mockEvent, startDate: undefined },
      });

      expect(result1).toBe('');
      expect(result2).toBe('');
      expect(result3).toBe('');
    });

    test('should generate plain text content for RSVP confirmation', () => {
      const result = generatePlainTextContent(mockEventRSVP);

      expect(result).toContain(`You're RSVP'd for ${mockEvent.name}!`);
      expect(result).toContain('Date & Time:');
      expect(result).toContain('Location:');
      expect(result).toContain('Details:');
      expect(result).toContain('Add to Calendar:');
      expect(result).toContain('Google:');
      expect(result).toContain('iCal:');
      expect(result).toContain('Invite Friends:');
      expect(result).toContain('Update your RSVP:');
    });

    test('should generate plain text content for event reminder', () => {
      const result = generatePlainTextContent(mockEventRSVP, { isReminder: true });

      expect(result).toContain(`Event Reminder: ${mockEvent.name}!`);
      expect(result).toContain(mockEvent.reminderText);
    });

    test('should use custom reminder text if provided', () => {
      const customReminderText = 'Custom reminder text from options';
      const result = generatePlainTextContent(mockEventRSVP, {
        isReminder: true,
        reminderText: customReminderText,
      });

      expect(result).toContain(customReminderText);
    });
  });

  describe('readEmailTemplate', () => {
    test('should read the email template file', () => {
      // Mock the path.join and fs.readFileSync functions
      (path.join as jest.Mock).mockReturnValue('/path/to/template.html');
      (fs.readFileSync as jest.Mock).mockReturnValue('Mock template content');

      const result = readEmailTemplate();

      expect(path.join).toHaveBeenCalledWith(expect.any(String), 'event-email-template.html');
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/template.html', 'utf8');
      expect(result).toBe('Mock template content');
    });
  });
});
