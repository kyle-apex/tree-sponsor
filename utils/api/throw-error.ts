import { NextApiResponse } from 'next';

export default function throwError(res: NextApiResponse, errorMessage: string) {
  console.log('errorMessage', errorMessage);
  res.status(500).json({ message: errorMessage });
}
