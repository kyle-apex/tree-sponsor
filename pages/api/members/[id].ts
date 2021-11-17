// TODO
import { NextApiRequest, NextApiResponse } from 'next';

//import { getSession } from 'utils/auth/get-session';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  //const session = await getSession({ req });

  res.status(200).json({});
}
