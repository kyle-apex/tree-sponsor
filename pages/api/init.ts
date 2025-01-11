import { NextApiRequest, NextApiResponse } from 'next';
import initializeApplication from 'utils/initialize-application';
import addHasShirtTag from 'utils/mailchimp/add-has-shirt-tag';
import syncActiveMemberGroups from 'utils/mailchimp/sync-active-member-groups';
import syncActiveMemberTags from 'utils/mailchimp/sync-active-member-tags';
import { updateSpeciesPriority } from 'utils/tree/update-species-priority';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  addHasShirtTag();
  await updateSpeciesPriority();
  await initializeApplication();

  await syncActiveMemberGroups();
  res.status(200).json('Initialized');
}
