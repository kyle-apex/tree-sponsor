import { NextApiRequest, NextApiResponse } from 'next';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const items = await prisma.subdomainRedirect.findMany({
      orderBy: { subdomain: 'asc' },
    });
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    if (!(await isCurrentUserAuthorized('hasRedirectManagement', req))) return;

    const item = await prisma.subdomainRedirect.create({ data: req.body });
    res.status(200).json(item);
  }
}
