import { NextApiRequest, NextApiResponse } from 'next';
import { getCoreTeamBios } from 'utils/user/get-core-team-bios';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['GET'],
});
const getBios = async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const users = await getCoreTeamBios();
  res.status(200).json(users);
};

export default cors(getBios as any);
