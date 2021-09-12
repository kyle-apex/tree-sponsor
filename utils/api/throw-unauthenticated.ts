import { NextApiResponse } from 'next';

export default function throwUnauthenticated(res: NextApiResponse) {
  res.status(401).json({});
}
