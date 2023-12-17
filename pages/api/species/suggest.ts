import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import { Prisma } from '@prisma/client';
import { identifySuggestions } from 'utils/tree/identify-suggestions';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Set desired value here
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    //console.log('req.body.imageContent', req.body.imageContent);
    const results = await identifySuggestions(req.body.imageContent, req.body.secondaryImages);
    console.log('results', results);
    res.status(200).json(results);
  }
}
