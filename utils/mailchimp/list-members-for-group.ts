import { mailchimpGet } from './';

const listMembersForGroup = async (groupingId: string, groupId: string): Promise<any[]> => {
  let results: any[] = [];

  if (groupingId && groupId) {
    try {
      const memberResults = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
        fields: 'members.email_address,members.id',
        interest_category_id: groupingId,
        interest_ids: groupId,
        interest_match: 'all',
        count: 500,
      });
      results = memberResults.members;
    } catch (error) {
      console.error('Caught error fetching members for group:', error);
    }
  }

  return results?.map(item => item.email_address) || [];
};
export default listMembersForGroup;
