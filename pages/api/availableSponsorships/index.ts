import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getAvailableSponsorships } from 'utils/prisma/get-available-sponsorships';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  console.log('called', req.method);
  if (req.method === 'GET') {
    const sponsorships = await getAvailableSponsorships(userId);
    res.status(200).json(sponsorships);
  }
}
