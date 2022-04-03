import mailchimp, { mailchimpGet } from '.';

const getActiveGroups = async () => {
  const groupingName = process.env.MAILCHIMP_GROUPING_NAME ?? 'Membership [AUTO]';
  const activeGroupName = process.env.MAILCHIMP_ACTIVE_GROUP ?? 'Active Member';
  const inactiveGroupName = process.env.MAILCHIMP_INACTIVE_GROUP ?? 'Inactive Member';
  let activeGroupId, inactiveGroupId;

  const results = await mailchimpGet(`/lists/${process.env.MAILCHIMP_LIST_ID}/interest-categories`, { count: 100 });

  const category = results?.categories?.find((category: any) => {
    if (category.title == groupingName) return true;
  });

  if (category) {
    const results = await mailchimpGet(`/lists/${process.env.MAILCHIMP_LIST_ID}/interest-categories/${category.id}/interests`, {
      count: 100,
    });
    const activeInterest = results?.interests?.find((interest: any) => {
      if (interest.name == activeGroupName) return true;
    });
    activeGroupId = activeInterest?.id;

    const inactiveInterest = results?.interests?.find((interest: any) => {
      if (interest.name == inactiveGroupName) return true;
    });
    inactiveGroupId = inactiveInterest?.id;
  }

  return { activeGroupId, inactiveGroupId, groupingId: category?.id };
};
export default getActiveGroups;
