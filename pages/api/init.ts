import { NextApiRequest, NextApiResponse } from 'next';
import initializeApplication from 'utils/initialize-application';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeApplication();
  res.status(200).json('Initialized');
}
