import { updateUser } from 'utils/prisma/update-user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('req3', req);
  const id = Number(req.query.id);
  if (req.method === 'POST') {
    const result = await updateUser(id, req.body);
    res.status(200).json(result);
  }
}
