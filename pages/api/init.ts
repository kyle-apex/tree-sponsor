import { NextApiRequest, NextApiResponse } from 'next';
import initializeApplication from 'utils/initialize-application';
import { mailchimpGet } from 'utils/mailchimp';
import syncActiveMemberGroups from 'utils/mailchimp/sync-active-member-groups';
import syncActiveMemberTags from 'utils/mailchimp/sync-active-member-tags';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  await initializeApplication();
  ///lists/{list_id}/interest-categories
  //const result = await mailchimpGet(`lists/${process.env.MAILCHIMP_LIST_ID}/members`); //await mailchimpGet(`/lists/${process.env.MAILCHIMP_LIST_ID}/interest-categories`);
  //console.log('result', result);
  await syncActiveMemberGroups();
  res.status(200).json('Initialized');
}
