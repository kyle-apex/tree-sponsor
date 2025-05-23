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
2. `scripts/send-event-reminders.ts` - Script that can be run on a schedule to process reminders

### User Interface

Event organizers can customize the reminder text for each event using the "Reminder Email Text" field in the event edit form. If no custom text is provided, a default message will be used.

## Setup Instructions

### Running the Reminder Script

The reminder script should be run on a schedule (e.g., hourly) to check for events happening in approximately 24 hours and send reminder emails.

#### Setting up a Cron Job

To set up a cron job to run the script hourly:

1. Make the script executable:

   ```bash
   chmod +x scripts/send-event-reminders.ts
   ```

2. Add a cron job to run the script hourly:

   ```bash
   crontab -e
   ```

3. Add the following line to run the script every hour:

   ```
   0 * * * * cd /path/to/project && ts-node scripts/send-event-reminders.ts >> logs/event-reminders.log 2>&1
   ```

4. Make sure the logs directory exists:
   ```bash
   mkdir -p logs
   ```

### Testing

To test the reminder system:

1. Create an event with a start date approximately 24 hours in the future
2. Create an RSVP for the event with 'Going' or 'Maybe' status
3. Run the reminder script manually:
   ```bash
   ts-node scripts/send-event-reminders.ts
   ```
4. Check the logs to see if the reminder email was sent
5. Verify that the `reminderSentAt` field was updated in the database

## Troubleshooting

If reminder emails are not being sent:

1. Check that the cron job is running correctly
2. Verify that there are events happening in approximately 24 hours
3. Ensure that there are RSVPs with 'Going' or 'Maybe' status for those events
4. Check that the `reminderSentAt` field is not already set for those RSVPs
5. Verify that the email sending infrastructure is working correctly
