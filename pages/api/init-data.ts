/**/

import { NextApiRequest, NextApiResponse } from 'next';
import initAdmin from 'utils/data/init-admin';
import initDemoData from 'utils/data/init-demo-data';
import initSpecies from 'utils/data/init-species';
import fixSubscriptionWithDetailsView from 'utils/prisma/fix-subscription-with-details-view';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  await fixSubscriptionWithDetailsView();
  await initSpecies();
  const admin = await initAdmin();
  initDemoData(admin?.id);

  res.status(200).json('Initialized');
}
