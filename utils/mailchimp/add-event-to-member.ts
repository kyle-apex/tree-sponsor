import { mailchimpPost } from '.';
import md5 from 'md5';

const addEventToMember = async (email: string, eventName: string) => {
  try {
    await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/members/${md5(email.toLowerCase())}/events`, {
      name: eventName?.replace(/ /g, '_'),
    });
  } catch (err) {
    console.error('Unable to add event to ', email, eventName);
    console.error(err);
  }
};
export default addEventToMember;
