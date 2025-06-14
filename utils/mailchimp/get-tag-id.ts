import { mailchimpGet } from '.';

const getTagId = async (tagName: string): Promise<number> => {
  let tagResponse;
  try {
    tagResponse = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/tag-search`, {
      name: tagName,
    });
  } catch (error) {
    console.error('Caught error fetching tag ID:', error);
  }
  //console.log('tagResponse', tagResponse);
  const tag = tagResponse?.tags?.length > 0 ? tagResponse.tags[0] : null;

  return tag?.id;
};

export default getTagId;
