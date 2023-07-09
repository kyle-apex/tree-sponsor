import RoleTable from 'components/admin/RoleTable';
import { PartialEventCheckIn, PartialTree, PartialUser } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import findOrCreateCheckinUser from 'utils/events/find-or-create-checkin-user';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import { prisma, Prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = String(req.query.email);
  const firstName = String(req.query.firstName);
  const lastName = String(req.query.lastName);
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
        const result = await addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false);
      }
    }

    res.status(200).json({ email: user?.email });
  }
}
