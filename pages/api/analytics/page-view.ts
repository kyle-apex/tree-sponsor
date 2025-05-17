import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pageUrl, visitorId, email, queryParams, userAgent, ipAddress, userId } = req.body;

    if (!pageUrl || !visitorId) {
      return res.status(400).json({ message: 'Missing required fields: pageUrl and visitorId' });
    }

    // Create the page view record
    const pageView = await prisma.$queryRaw`
      INSERT INTO PageView (pageUrl, visitorId, email, queryParams, userAgent, ipAddress, userId)
      VALUES (${pageUrl}, ${visitorId}, ${email || null}, ${queryParams || null}, ${userAgent || null}, ${ipAddress || null}, ${
      userId || null
    })
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return res.status(500).json({ message: 'Error tracking page view', error });
  }
}
