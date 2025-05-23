import { NextApiRequest, NextApiResponse } from 'next';
import { processEventReminders } from 'utils/email/send-event-reminder';

/**
 * API endpoint to process event reminders
 *
 * This endpoint can be called every 30 minutes by an external service (e.g., cron job)
 * to check for events happening in approximately 24 hours and send reminder emails
 * to users who have RSVP'd with 'Going' or 'Maybe' status.
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Optional: Add API key validation for security
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.EVENT_REMINDER_API_KEY;

  if (expectedApiKey && apiKey !== expectedApiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('=== Event Reminder Email Job Started ===');
    console.log(`Time: ${new Date().toISOString()}`);

    // Process event reminders
    await processEventReminders();

    console.log('=== Event Reminder Email Job Completed ===');

    return res.status(200).json({
      success: true,
      message: 'Event reminder emails processed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing event reminder emails:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing event reminder emails',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
