import { mailchimpPost } from '.';

const addTagToMembers = async (tagId: number, emails: string[]) => {
  await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}`, {
    members_to_add: emails,
  });
};
export default addTagToMembers;
