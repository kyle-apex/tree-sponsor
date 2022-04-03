import { mailchimpPatch } from '.';
import md5 from 'md5';

const removeGroupFromMembers = async (groupId: string, emails: string[]) => {
  emails.forEach(async email => {
    try {
      await mailchimpPatch(`lists/${process.env.MAILCHIMP_LIST_ID}/members/${md5(email.toLowerCase())}`, {
        interests: { [groupId]: false },
      });
    } catch (err) {
      console.error('Unable to remove group from ', email);
    }
  });
};
export default removeGroupFromMembers;
