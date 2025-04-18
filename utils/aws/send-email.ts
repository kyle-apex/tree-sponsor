import nodemailer from 'nodemailer';

// Since we don't have type definitions for nodemailer-sendgrid, we'll use require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailerSendgrid = require('nodemailer-sendgrid');

/**
 * Configures the nodemailer transporter with SendGrid credentials
 */
const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY2,
  }),
);

/**
 * Sends an email using SendGrid
 * @param recipients Array of email addresses to send to
 * @param subject Email subject line
 * @param body Plain text email body (fallback)
 * @param html HTML email body
 * @returns Boolean indicating success or failure
 */
export default async function sendEmail(recipients: string[], subject: string, body: string, html: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SUPPORT_EMAIL,
      to: recipients.join(','),
      subject: subject,
      text: body,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('[sendEmail] Error sending email:', error);
    return false;
  }
}
