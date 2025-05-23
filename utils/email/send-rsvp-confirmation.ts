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
  setTimeout(async () => {
    if (eventRSVP?.id) {
      const currentRSVP = await prisma.eventRSVP.findFirst({ where: { id: eventRSVP.id } });
      // Check if the RSVP status has changed to avoid sending an email for an earlier status
      if (currentRSVP?.status !== eventRSVP.status) {
        return;
      }
    }

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

    // Generate preview text based on RSVP status
    const previewText =
      eventRSVP.status === 'Going'
        ? `Get ready for an amazing time at ${event.name}. Share with your crew for an even better time!`
        : `Thanks for letting us know you might join us at ${event.name}. We hope to see you there!`;

    // Send the email
    return await sendEmail([user.email], subject, plainText, emailHtml, 'TreeFolks Young Professionals', previewText);
  } catch (error) {
    console.error('[sendRsvpConfirmation] Error sending RSVP confirmation email:', error);
    return false;
  }
};

export { sendRsvpConfirmation, scheduleSendRsvpConfirmation };
