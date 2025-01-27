import { mailchimpPost } from '.';
import getTagId from './get-tag-id';

const addTagToMembersByName = async (tagName: string, emails: string[], mailchimpListId?: string): Promise<void> => {
  if (!mailchimpListId) mailchimpListId = process.env.MAILCHIMP_LIST_ID;

  let tagId = await getTagId(tagName);
  //console.log('tagId', tagId);
  if (!tagId) {
    //console.log('before segmet post');
    const segment = await mailchimpPost(`lists/${mailchimpListId}/segments`, { name: tagName, static_segment: emails });
    //console.log('segment', segment);
    tagId = segment?.id;
  }
  if (!tagId) return;
  try {
    const result = await mailchimpPost(`lists/${mailchimpListId}/segments/${tagId}`, {
      members_to_add: emails,
    });
    //console.log('result', result);
  } catch (err) {
    console.log('err', err);
  }
};

export default addTagToMembersByName;
