import getTagId from 'utils/mailchimp/get-tag-id';
import listMembersForTag from 'utils/mailchimp/list-members-for-tag';

test('it should list mailchimp emails for a tag', async () => {
  const members = await listMembersForTag(await getTagId('Core Team'));
  expect(members.length).toBeGreaterThan(0);
});
