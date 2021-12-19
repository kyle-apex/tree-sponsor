import { updateUser } from 'utils/prisma/update-user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method === 'PATCH') {
    const result = await updateUser(id, req.body);
    res.status(200).json(result);
  }
}
