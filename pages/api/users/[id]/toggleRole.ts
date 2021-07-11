import { NextApiRequest, NextApiResponse } from 'next';
import grantAccess from 'utils/auth/grant-access';
import removeAccess from 'utils/auth/remove-access';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'POST') {
    const { roleName, hasRole } = req.body;

    if (hasRole) grantAccess(id, roleName);
    else removeAccess(id, roleName);
  }
}
