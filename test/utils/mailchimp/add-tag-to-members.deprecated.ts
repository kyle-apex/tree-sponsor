import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import getTagId from 'utils/mailchimp/get-tag-id';
import listMembersForTag from 'utils/mailchimp/list-members-for-tag';
import removeTagFromMembers from 'utils/mailchimp/remove-tag-from-members';

test('it should list mailchimp emails for a tag', async () => {
  const tagId = await getTagId('Core Team');
  let members = await listMembersForTag(tagId);
  //const intitialLength = members.length;

  await addTagToMembers(tagId, ['kyle@kylehoskins.com']);
  members = await listMembersForTag(tagId);
  const addedLength = members.length;
  //expect(members.length).toBe(intitialLength + 1);

  await removeTagFromMembers(tagId, ['kyle@kylehoskins.com']);
  members = await listMembersForTag(tagId);
  expect(members.length).toBe(addedLength - 1);
});
