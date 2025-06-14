import { upsertSubscriptions } from './prisma/upsert-subscriptions';
import { findAllSubscriptions } from './stripe/find-all-subscriptions';
import { prisma } from 'utils/prisma/init';
import initSpecies from './data/init-species';
import initAdmin from './data/init-admin';
import initDemoData from './data/init-demo-data';
import fixSubscriptionWithDetailsView from './prisma/fix-subscription-with-details-view';
import initDemoUsers from './data/init-demo-users';

export default async function initializeApplication() {
  // for some reason, full population requires calling this twice
  const t1 = new Date().getTime();
  await upsertSubscriptions(await findAllSubscriptions());
  console.log('upsert total time', new Date().getTime() - t1);
  await upsertSubscriptions(await findAllSubscriptions());
  await fixSubscriptionWithDetailsView();

  const admin = await initAdmin();
  await initSpecies();

  initDemoData(admin?.id).catch(error => {
    console.error('Error initializing demo data:', error);
  });

  initDemoUsers().catch(error => {
    console.error('Error initializing demo users:', error);
  });
}
