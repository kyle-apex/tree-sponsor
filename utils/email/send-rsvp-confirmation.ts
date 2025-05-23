import { PartialEventRSVP } from 'interfaces';
import sendEmail from 'utils/email/send-email';
import * as EmailUtils from 'utils/email/email-utils';

/**
 * Schedules sending an RSVP confirmation email after a delay
 * @param eventRSVP - The event RSVP data containing both event and user details
 * @param delayMs - Delay in milliseconds before sending the email (default: 2 minutes),
 * @returns Promise that resolves when the email is scheduled
 */
const scheduleSendRsvpConfirmation = async (
  eventRSVP: PartialEventRSVP,
  delayMs = 2 * 60 * 1000, // 2 minutes by default
): Promise<void> => {
  // Schedule the email to be sent after the delay
  setTimeout(() => {
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
    const template = EmailUtils.readEmailTemplate();

    // Process the template (with isReminder set to false)
    const heading = eventRSVP.status === 'Going' ? "🎉 You're RSVP'd!" : "🤔 You've RSVP'd Maybe!";
    const emailHtml = EmailUtils.processTemplate(template, eventRSVP, {
      isReminder: false,
      heading,
    });

    // Generate plain text content
    const plainText = EmailUtils.generatePlainTextContent(eventRSVP, { isReminder: false });

    // Set the subject line
    const subject = `${eventRSVP.status === 'Going' ? "🎉 You're RSVP'd" : "🤔 You've RSVP'd Maybe!"}: ${event.name}`;

    // Send the email
    return await sendEmail([user.email], subject, plainText, emailHtml);
  } catch (error) {
    console.error('[sendRsvpConfirmation] Error sending RSVP confirmation email:', error);
    return false;
  }
};

export { sendRsvpConfirmation, scheduleSendRsvpConfirmation };
