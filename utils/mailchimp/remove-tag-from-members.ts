import { mailchimpPost } from '.';
const removeTagFromMembers = async (tagId: number, emails: string[]) => {
  await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}`, {
    members_to_remove: emails,
  });
};
export default removeTagFromMembers;
