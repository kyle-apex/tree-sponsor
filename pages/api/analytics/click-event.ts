import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pageUrl, actionName, destinationUrl, visitorId, email, queryParams, userAgent, userId } = req.body;

    if (!pageUrl || !visitorId || !actionName) {
      return res.status(400).json({ message: 'Missing required fields: pageUrl, visitorId, and actionName' });
    }

    // Extract IP address from request
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : req.socket.remoteAddress || null;

    // Create the click event record using Prisma's structured API
    const clickEvent = await prisma.clickEvent.create({
      data: {
        pageUrl,
        actionName,
        destinationUrl: destinationUrl || null,
        visitorId,
        email: email || null,
        queryParams: queryParams || null,
        userAgent: userAgent || null,
        ipAddress,
        userId: userId || null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking click event:', error);
    return res.status(500).json({ message: 'Error tracking click event', error });
  }
}
