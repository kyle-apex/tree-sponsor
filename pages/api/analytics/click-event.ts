import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pageUrl, actionName, destinationUrl, visitorId, email, queryParams, userAgent, ipAddress, userId } = req.body;

    if (!pageUrl || !visitorId || !actionName) {
      return res.status(400).json({ message: 'Missing required fields: pageUrl, visitorId, and actionName' });
    }

    // Create the click event record
    const clickEvent = await prisma.$queryRaw`
      INSERT INTO ClickEvent (pageUrl, actionName, destinationUrl, visitorId, email, queryParams, userAgent, ipAddress, userId)
      VALUES (${pageUrl}, ${actionName}, ${destinationUrl || null}, ${visitorId}, ${email || null}, ${queryParams || null}, ${
      userAgent || null
    }, ${ipAddress || null}, ${userId || null})
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking click event:', error);
    return res.status(500).json({ message: 'Error tracking click event', error });
  }
}
