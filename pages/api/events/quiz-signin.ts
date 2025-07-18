import RoleTable from 'components/admin/RoleTable';
import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import findOrCreateCheckinUser from 'utils/events/find-or-create-checkin-user';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = String(req.query.email)?.trim();
  const firstName = String(req.query.firstName)?.trim();
  const lastName = String(req.query.lastName)?.trim();
  const discoveredFrom = String(req.query.discoveredFrom);
  const emailOptIn = req.query.emailOptIn === 'true';
  if (!email) return;

  if (req.method === 'GET') {
    const user = await findOrCreateCheckinUser({
      email,
      firstName,
      lastName,
    });

    if (emailOptIn && firstName) {
      if (email) {
        addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false).catch(error => {
          console.error('Error adding subscriber:', error);
        });
      }
    }
    res.status(200).json({ email: user?.email });
  }
}
