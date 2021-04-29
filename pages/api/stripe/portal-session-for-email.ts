import { NextApiRequest, NextApiResponse } from 'next';
import createPortalSessionForEmail from 'utils/stripe/create-portal-session-for-email';
import { getSession } from 'next-auth/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  console.log('session', session);
  const portalSession = await createPortalSessionForEmail(session?.user?.email ?? '');
  res.status(200).json({ text: portalSession?.url });
}
