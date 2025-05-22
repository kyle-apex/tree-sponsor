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
 * @param fromName Optional sender name to display (defaults to "TreeFolks Young Professionals")
 * @param previewText Optional preview text that appears in email clients
 * @returns Boolean indicating success or failure
 */
export default async function sendEmail(
  recipients: string[],
  subject: string,
  body: string,
  html: string,
  fromName = 'TreeFolks Young Professionals',
  previewText?: string,
): Promise<boolean> {
  try {
    let finalHtml = html;

    // Add preview text to HTML if provided
    if (previewText) {
      // Add hidden preview text at the beginning of the HTML
      const previewTextHtml = `
        <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent;">
          ${previewText}
        </div>
      `;

      // Insert after opening body tag or at the beginning if no body tag
      if (finalHtml.includes('<body')) {
        finalHtml = finalHtml.replace(/(<body[^>]*>)/i, `$1${previewTextHtml}`);
      } else {
        finalHtml = previewTextHtml + finalHtml;
      }
    }

    const mailOptions: any = {
      from: {
        name: fromName,
        address: process.env.SUPPORT_EMAIL as string,
      },
      to: recipients.join(','),
      subject: subject,
      text: body,
      html: finalHtml,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('[sendEmail] Error sending email:', error);
    return false;
  }
}
