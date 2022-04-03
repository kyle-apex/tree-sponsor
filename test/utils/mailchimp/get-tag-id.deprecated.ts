import getTagId from 'utils/mailchimp/get-tag-id';

test('should get mailchimp tag id', async () => {
  const tagId = await getTagId('Core Team');
  expect(tagId).toBe(3379698);
});
