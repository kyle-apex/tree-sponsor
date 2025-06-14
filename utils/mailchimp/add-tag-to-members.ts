import { mailchimpPost } from '.';

const addTagToMembers = async (tagId: number, emails: string[]) => {
  try {
    await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}`, {
      members_to_add: emails,
    });
  } catch (error) {
    console.error('Caught error adding tag to members:', error);
  }
};
export default addTagToMembers;
