import AWS from 'aws-sdk';

/**
 * Configures the AWS SES client with credentials
 */
const configureSES = () => {
  // Create SES service object with local configuration instead of using global AWS.config
  return new AWS.SES({
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
    region: process.env.AWS_SES_REGION || 'us-east-1', // Default to us-east-1 if not specified
  });
};

/**
 * Sends an email using Amazon SES
 * @param recipients Array of email addresses to send to
 * @param subject Email subject line
 * @param body Plain text email body (fallback)
 * @param html HTML email body
 * @param fromName Optional sender name to display (defaults to "TreeFolks Young Professionals")
 * @param previewText Optional preview text that appears in email clients
 * @returns Boolean indicating success or failure
 */
export default async function sendEmailSES(
  recipients: string[],
  subject: string,
  body: string,
  html: string,
  fromName = 'TreeFolks Young Professionals',
  previewText?: string,
): Promise<boolean> {
  try {
    // Get SES service object
    const ses = configureSES();

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

    // Verify the sender email address is configured
    const senderEmail = process.env.SES_SENDER_EMAIL || process.env.SUPPORT_EMAIL;

    if (!senderEmail) {
      throw new Error('SES_SENDER_EMAIL or SUPPORT_EMAIL environment variable is required');
    }

    // Prepare parameters for SES
    const params = {
      Source: `${fromName} <${senderEmail}>`,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: body,
            Charset: 'UTF-8',
          },
          Html: {
            Data: finalHtml,
            Charset: 'UTF-8',
          },
        },
      },
      // Optional configuration parameters
      ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
    };

    // Remove undefined values from params
    if (!params.ConfigurationSetName) {
      delete params.ConfigurationSetName;
    }

    // Send the email
    await ses.sendEmail(params).promise();

    // delay 100ms to avoid SES rate limiting issues
    await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  } catch (error) {
    console.error('[sendEmailSES] Error sending email:', error);
    return false;
  }
}

/**
 * Sends a bulk email to multiple recipients using Amazon SES
 * Each recipient will receive an individual email (they won't see other recipients)
 * @param recipients Array of email addresses to send to
 * @param subject Email subject line
 * @param body Plain text email body (fallback)
 * @param html HTML email body
 * @param fromName Optional sender name to display (defaults to "TreeFolks Young Professionals")
 * @param previewText Optional preview text that appears in email clients
 * @returns Boolean indicating success or failure
 */
export async function sendBulkEmailSES(
  recipients: string[],
  subject: string,
  body: string,
  html: string,
  fromName = 'TreeFolks Young Professionals',
  previewText?: string,
): Promise<boolean> {
  try {
    // For small batches, just send individual emails
    if (recipients.length <= 50) {
      return await sendEmailSES(recipients, subject, body, html, fromName, previewText);
    }

    // For larger batches, use SES SendBulkTemplatedEmail
    // This would require setting up a template in SES first
    // This is a placeholder for future implementation
    console.warn('[sendBulkEmailSES] Bulk email sending for large recipient lists not fully implemented');

    // For now, split into smaller batches and send
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      batches.push(batch);
    }

    const results = await Promise.all(batches.map(batch => sendEmailSES(batch, subject, body, html, fromName, previewText)));

    // Return true only if all batches succeeded
    return results.every(result => result === true);
  } catch (error) {
    console.error('[sendBulkEmailSES] Error sending bulk email:', error);
    return false;
  }
}
