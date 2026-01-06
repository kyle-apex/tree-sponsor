import { mailchimpPost } from '.';
const removeTagFromMembers = async (tagId: number, emails: string[]) => {
  try {
    await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}`, {
      members_to_remove: emails,
    });
  } catch (error) {
    console.error('Caught error removing tag from members:', error);
  }
};
export default removeTagFromMembers;
