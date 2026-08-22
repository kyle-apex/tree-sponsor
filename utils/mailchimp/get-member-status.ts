import crypto from 'crypto';
import { mailchimpGet } from '.';

const getMemberStatus = async (email: string, mailchimpListId?: string): Promise<string | null> => {
  if (!mailchimpListId) mailchimpListId = process.env.MAILCHIMP_LIST_ID;
  const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  try {
    const member = await mailchimpGet(`lists/${mailchimpListId}/members/${subscriberHash}`);
    return member?.status ?? null;
  } catch (err) {
    // 404 means not a member yet
    return null;
  }
};

export default getMemberStatus;
