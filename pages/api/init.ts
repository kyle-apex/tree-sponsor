import { NextApiRequest, NextApiResponse } from 'next';
import initializeApplication from 'utils/initialize-application';
import addHasShirtTag from 'utils/mailchimp/add-has-shirt-tag';
import syncActiveMemberGroups from 'utils/mailchimp/sync-active-member-groups';
import syncUsersFromMailchimp from 'utils/mailchimp/sync-users-from-mailchimp';
import { updateSpeciesPriority } from 'utils/tree/update-species-priority';

import syncSubscriptionTags from 'utils/mailchimp/sync-subscription-tags';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  addHasShirtTag();
  await updateSpeciesPriority();
  await initializeApplication();

  await syncActiveMemberGroups();

  // Sync users from Mailchimp to ensure database has all subscribers
  await syncUsersFromMailchimp();

  await syncSubscriptionTags();

  res.status(200).json('Initialized');
}
