#!/usr/bin/env ts-node
/**
 * Script to send reminder emails for events happening in 24 hours
 *
 * This script should be run on a schedule (e.g., hourly) to check for events
 * happening in approximately 24 hours and send reminder emails to users who
 * have RSVP'd with 'Going' or 'Maybe' status.
 *
 * Example cron job (runs every hour):
 * 0 * * * * cd /path/to/project && ts-node scripts/send-event-reminders.ts >> logs/event-reminders.log 2>&1
 */

import { processEventReminders } from '../utils/email/send-event-reminder';

async function main() {
  console.log('=== Event Reminder Email Job Started ===');
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    await processEventReminders();
    console.log('Event reminder emails processed successfully');
  } catch (error) {
    console.error('Error processing event reminder emails:', error);
  }

  console.log('=== Event Reminder Email Job Completed ===');
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error in script:', error);
    process.exit(1);
  });
