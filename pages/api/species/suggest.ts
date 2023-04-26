import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';
import { identifySuggestions } from 'utils/tree/identify-suggestions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('req.body.imageContent', req.body.imageContent);
    const results = await identifySuggestions(req.body.imageContent);
    console.log('results', results);
    res.status(200).json(results);
  }
}
