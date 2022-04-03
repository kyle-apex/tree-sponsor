import { mailchimpGet } from '.';

const getTagId = async (tagName: string): Promise<number> => {
  const segmentsOutput = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/segments`, { fields: 'segments.id,segments.name' });
  console.log('segmentsOutput', segmentsOutput);
  const segment = segmentsOutput?.segments?.find((segment: any) => {
    if (segment.name == tagName) return true;
  });

  return segment?.id;
};

export default getTagId;
