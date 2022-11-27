import { mailchimpPost } from '.';
import getTagId from './get-tag-id';

const addTagToMembersByName = async (tagName: string, emails: string[]): Promise<void> => {
  let tagId = await getTagId(tagName);
  console.log('tagId', tagId);
  if (!tagId) {
    console.log('before segmet post');
    const segment = await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments`, { name: tagName, static_segment: emails });
    console.log('segment', segment);
    tagId = segment?.id;
  } else {
    try {
      const result = await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments/${tagId}`, {
        members_to_add: emails,
      });
      console.log('result', result);
    } catch (err) {
      console.log('err', err);
    }
  }
};

export default addTagToMembersByName;
