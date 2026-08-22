import crypto from 'crypto';
import { mailchimpPatch } from '.';

const updateMemberStatus = async (email: string, status: 'subscribed' | 'unsubscribed', mailchimpListId?: string): Promise<void> => {
  if (!mailchimpListId) mailchimpListId = process.env.MAILCHIMP_LIST_ID;
  const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  try {
    await mailchimpPatch(`lists/${mailchimpListId}/members/${subscriberHash}`, { status });
  } catch (err) {
    console.error(`Error updating Mailchimp member status to ${status} for ${email}:`, err);
  }
};

export default updateMemberStatus;
