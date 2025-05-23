# Event Reminder Email System

This document describes the automatic event reminder email system that sends emails to users who have RSVP'd to events 24 hours before the event starts.

## Overview

The system automatically sends reminder emails to users who have RSVP'd with 'Going' or 'Maybe' status exactly 24 hours before an event starts. The reminder emails use the same template as the RSVP confirmation emails but include an additional section with a reminder message.

## Features

- Sends reminder emails 24 hours before events
- Only sends to users with 'Going' or 'Maybe' RSVP status
- Prevents duplicate reminder emails (each RSVP only gets one reminder)
- Customizable reminder text per event
- Uses existing email infrastructure

## Implementation Details

### Database Schema

Two new fields were added to the database schema:

1. `reminderText` on the `Event` model - Allows event organizers to customize the reminder message
2. `reminderSentAt` on the `EventRSVP` model - Tracks when a reminder was sent to prevent duplicates

### Email Template

A unified email template `event-email-template.html` is used for both RSVP confirmations and event reminders. The template includes conditional sections that are displayed or hidden based on the email type. For event reminders, an additional reminder section is displayed above the Date & Time section.

### Code Components

1. `utils/email/send-event-reminder.ts` - Contains the core functionality for sending reminder emails
2. `pages/api/events/reminders.ts` - API endpoint that can be called to process reminders

### User Interface

Event organizers can customize the reminder text for each event using the "Reminder Email Text" field in the event edit form. If no custom text is provided, a default message will be used.

## Setup Instructions

### Calling the Reminder API Endpoint

The reminder system is now implemented as an API endpoint that should be called every 30 minutes to check for events happening in approximately 24 hours and send reminder emails.

#### Setting up a Scheduled Task

To set up a scheduled task to call the API endpoint:

1. Configure an API key for security (optional but recommended):

   Add the following to your environment variables:

   ```
   EVENT_REMINDER_API_KEY=your-secure-random-key
   ```

2. Set up a cron job or scheduled task to call the API endpoint every 30 minutes:

   ```bash
   # Using curl (example for cron job)
   */30 * * * * curl -X POST -H "x-api-key: your-secure-random-key" https://your-domain.com/api/events/reminders
   ```

3. For local development, you can use tools like cURL to test the endpoint:
   ```bash
   curl -X POST -H "x-api-key: your-secure-random-key" http://localhost:3000/api/events/reminders
   ```

### Testing

To test the reminder system:

1. Create an event with a start date approximately 24 hours in the future
2. Create an RSVP for the event with 'Going' or 'Maybe' status
3. Call the API endpoint manually:
   ```bash
   curl -X POST -H "x-api-key: your-api-key" http://localhost:3000/api/events/reminders
   ```
4. Check the API response and server logs to see if the reminder email was sent
5. Verify that the `reminderSentAt` field was updated in the database

## Troubleshooting

If reminder emails are not being sent:

1. Check that the scheduled task is running correctly and calling the API endpoint
2. Verify that there are events happening in approximately 24 hours
3. Ensure that there are RSVPs with 'Going' or 'Maybe' status for those events
4. Check that the `reminderSentAt` field is not already set for those RSVPs
5. Verify that the email sending infrastructure is working correctly
