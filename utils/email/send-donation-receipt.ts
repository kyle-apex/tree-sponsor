import sendEmail from 'utils/email/send-email';
import { convertToCST, formatDate } from 'utils/email/email-utils';

/**
 * Sends a donation receipt email to the donor
 * @param email - The donor's email address
 * @param amount - The donation amount
 * @returns Promise that resolves to a boolean indicating success or failure
 */
export const sendDonationReceipt = async (email: string, amount: number): Promise<boolean> => {
  try {
    if (!email || !amount) {
      console.error('[sendDonationReceipt] Missing required data:', { email, amount });
      return false;
    }

    // Create HTML email content directly
    const emailHtml = createDonationEmailHtml(amount);

    // Generate plain text content
    const plainText = generatePlainTextContent(amount);

    // Set the subject line
    const subject = `Thank You for Your Donation to TreeFolks!`;

    // Send the email
    return await sendEmail([email], subject, plainText, emailHtml, 'TreeFolks Young Professionals', null);
  } catch (error) {
    console.error('[sendDonationReceipt] Error sending donation receipt email:', error);
    return false;
  }
};

/**
 * Creates HTML email content for donation receipts
 * @param email - The donor's email address
 * @param amount - The donation amount
 * @returns HTML content for the email
 */
const createDonationEmailHtml = (amount: number): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Donation to TreeFolks</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <img src="https://www.tfyp.org/logo.png" alt="TreeFolks Logo" style="max-width: 150px; height: auto;">
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px; padding-top: 0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                
                <tr>
                  <td style="padding-bottom: 15px; line-height: 1.5;">
                    Thank you for your generous donation of <strong>$${amount}</strong> to TreeFolks.
                  </td>
                </tr>
                
                <tr>
                  <td style="padding-bottom: 15px; line-height: 1.5;">
                    Your contribution helps us plant and care for trees, making our community greener and healthier.
                  </td>
                </tr>
                
                <!-- Tax Receipt Information -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding-bottom: 15px; color: #476E62; margin: 0; font-size: 18px; font-weight: bold;">
                                Tax Receipt Information
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 5px; line-height: 1.5;">
                                TreeFolks EIN: 74-2569827
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 5px; line-height: 1.5;">
                                Donation Amount: $${amount}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 5px; line-height: 1.5;">
                                Donation Date: ${formatDate(convertToCST(new Date()))}
                              </td>
                            </tr>
                            <tr>
                              <td style="line-height: 1.5;">
                                This letter serves as your official receipt for tax purposes. No goods or services were provided in exchange for this contribution.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generates plain text content for the donation receipt email
 * @param amount - The donation amount
 * @returns Plain text content for the email
 */
const generatePlainTextContent = (amount: number): string => {
  let content = `Thank You for Your Donation to TreeFolks!\n\n`;

  content += `Thank you for your generous donation of $${amount} to TreeFolks.\n\n`;
  content += `Your contribution helps us plant and care for trees, making our community greener and healthier.\n\n`;
  content += `Tax Receipt Information:\n`;
  content += `TreeFolks EIN: 74-2569827\n`;
  content += `Donation Amount: $${amount}\n`;
  content += `Donation Date: ${formatDate(convertToCST(new Date()))}\n\n`;
  content += `This letter serves as your official receipt for tax purposes. No goods or services were provided in exchange for this contribution.\n\n`;

  content += `TreeFolks Young Professionals\n`;
  content += `© ${convertToCST(new Date()).getFullYear()} TreeFolksYP. All rights reserved.\n`;
  content += `Visit our website: https://www.tfyp.org`;

  return content;
};
