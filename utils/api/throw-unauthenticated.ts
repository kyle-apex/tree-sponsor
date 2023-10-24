import { NextApiResponse } from 'next';

export default function throwUnauthenticated(res: NextApiResponse) {
  console.log('not authenticated');
  res.status(401).json({});
}
