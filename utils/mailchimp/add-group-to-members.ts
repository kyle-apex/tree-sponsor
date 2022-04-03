import { mailchimpPatch } from '.';
import md5 from 'md5';

const addGroupToMembers = async (groupId: string, emails: string[]) => {
  emails.forEach(async email => {
    try {
      await mailchimpPatch(`lists/${process.env.MAILCHIMP_LIST_ID}/members/${md5(email.toLowerCase())}`, {
        interests: { [groupId]: true },
      });
    } catch (err) {
      console.error('Unable to add group to ', email);
    }
  });
};
export default addGroupToMembers;
