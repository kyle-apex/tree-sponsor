import { mailchimpGet } from './';

const listMembersForTag = async (tagId: number): Promise<any[]> => {
  let results: any[] = [];

  if (tagId) {
    const segmentMembers = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}/members`, {
      fields: 'members.email_address,members.id',
    });
    results = segmentMembers.members;
  }

  return results;
};
export default listMembersForTag;
