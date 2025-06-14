import { mailchimpGet } from './';

const listMembersForTag = async (tagId: number): Promise<any[]> => {
  let results: any[] = [];

  if (tagId) {
    try {
      const segmentMembers = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}/members`, {
        fields: 'members.email_address,members.id',
      });
      results = segmentMembers.members;
    } catch (error) {
      console.error('Caught error fetching members for tag:', error);
    }
  }

  return results?.map(item => item.email_address) || [];
};
export default listMembersForTag;
