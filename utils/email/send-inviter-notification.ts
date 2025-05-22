import fs from 'fs';
import path from 'path';
import { PartialEventRSVP, PartialUser } from 'interfaces';
import sendEmail from 'utils/email/send-email';
import formatTimeRange from 'utils/formatTimeRange';

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
 * Sends a notification email to the inviter when someone responds to their invitation
 * @param eventRSVP - The event RSVP data containing both event and user details
 * @param invitedByUser - The user who sent the invitation
 * @param comment - Optional message from the respondent
 * @returns Promise that resolves when the email is sent
 */
const sendInviterNotification = async (eventRSVP: PartialEventRSVP, invitedByUser: PartialUser, comment?: string): Promise<boolean> => {
  try {
    const { event, user, status } = eventRSVP;

    if (!event || !user || !invitedByUser.email) {
      console.error('[sendInviterNotification] Missing required data:', { event, user, invitedByUser });
      return false;
    }

    // Create a plain text version
    let plainText = `${user.name || 'Someone'} has ${
      status === 'Declined' ? 'declined' : status === 'Maybe' ? 'responded maybe to' : 'accepted'
    } your invitation to ${event.name}!`;

    if (status === 'Declined' && comment) {
      plainText += `\n\nThey left a message: "${comment}"`;
    }

    plainText += `\n\nEvent Details:
Date & Time: ${formatDate(new Date(event.startDate))} ${formatTimeRange(event.startDate, event.endDate)}
Location: ${event.location?.name} ${event.location?.address || ''}
Details: ${event.description || ''}

View event page: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org'}/e/${event.path}/invite?email=${encodeURIComponent(
      invitedByUser.email,
    )}`;

    // Set the subject line
    const emoji = status === 'Declined' ? '😔' : status === 'Maybe' ? '🤔' : '🎉';
    const action = status === 'Declined' ? 'declined' : status === 'Maybe' ? 'might attend' : 'is attending';
    const subject = `${emoji} ${user.name || 'Someone'} ${action} your event: ${event.name}`;

    // Create HTML version
    let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${user.name || 'Someone'} has ${
      status === 'Declined' ? 'declined' : status === 'Maybe' ? 'responded maybe to' : 'accepted'
    } your invitation</h2>
      <h3>${event.name}</h3>
      <p><strong>Date & Time:</strong> ${formatDate(new Date(event.startDate))} ${formatTimeRange(event.startDate, event.endDate)}</p>
      <p><strong>Location:</strong> ${event.location?.name} ${event.location?.address || ''}</p>
    `;

    if (status === 'Declined' && comment) {
      htmlContent += `
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-left: 4px solid #ddd;">
        <p style="font-style: italic;">"${comment}"</p>
      </div>
      `;
    }

    htmlContent += `
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://tfyp.org'}/e/${event.path}/invite?email=${encodeURIComponent(
      invitedByUser.email,
    )}" style="display: inline-block; background-color: #486e62; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Event</a></p>
    </div>
    `;

    // Send the email
    return await sendEmail([invitedByUser.email], subject, plainText, htmlContent);
  } catch (error) {
    console.error('[sendInviterNotification] Error sending inviter notification email:', error);
    return false;
  }
};

export { sendInviterNotification };
