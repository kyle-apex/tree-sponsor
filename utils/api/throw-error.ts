import { NextApiResponse } from 'next';

export default function throwError(res: NextApiResponse, errorMessage: string) {
  res.status(500).json({ message: errorMessage });
}
