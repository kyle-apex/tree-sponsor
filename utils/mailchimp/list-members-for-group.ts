import { mailchimpGet } from './';

const listMembersForGroup = async (groupingId: string, groupId: string): Promise<any[]> => {
  let results: any[] = [];

  if (groupingId && groupId) {
    const memberResults = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
      fields: 'members.email_address,members.id',
      interest_category_id: groupingId,
      interest_ids: groupId,
      interest_match: 'all',
      count: 500,
    });
    results = memberResults.members;
  }

  return results.map(item => item.email_address);
};
export default listMembersForGroup;
