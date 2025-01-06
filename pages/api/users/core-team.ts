import { NextApiRequest, NextApiResponse } from 'next';
import { getCoreTeamBios } from 'utils/user/get-core-team-bios';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const users = await getCoreTeamBios();
  res.status(200).json(users);
}
