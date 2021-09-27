import { NextApiRequest, NextApiResponse } from 'next';
import { createPortalSession } from 'utils/stripe/create-portal-session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('req3', req);
  const customerId: string = req.query.customerId as string;
  const portalSession = await createPortalSession(customerId, req.headers.referer + '?refresh=me');
  res.status(200).json({ url: portalSession?.url });
}
