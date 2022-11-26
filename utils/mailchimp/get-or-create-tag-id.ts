import { mailchimpPost } from '.';
import getTagId from './get-tag-id';

const getOrCreateTagId = async (tagName: string): Promise<number> => {
  let tagId = await getTagId(tagName);
  if (!tagId) {
    const segment = await mailchimpPost(`lists/${process.env.MAILCHIMP_LIST_ID}/segments`, { name: tagName });
    console.log('segment', segment);
    tagId = segment?.id;
  }

  return tagId;
};

export default getOrCreateTagId;
