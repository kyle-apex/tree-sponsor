import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

// Extend the NextApiResponse type to include socket property
interface SocketNextApiResponse extends NextApiResponse {
  socket: any;
}

export default async function handler(req: NextApiRequest, res: SocketNextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventId, eventPath, userName } = req.body;
    console.log('Received check-in request:', { eventId, eventPath, userName });

    if (!eventId || !eventPath || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine the base URL with the correct port
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3443';
    console.log('Using base URL for socket connection:', baseUrl);

    // Make sure socket.io is initialized
    console.log('Initializing socket.io...');
    await fetch(`${baseUrl}/api/socket`);

    // Access the socket.io instance from the server
    const io = res.socket?.server?.io;

    if (!io) {
      console.error('Socket.io instance not found');
      return res.status(500).json({ error: 'Socket.io instance not found' });
    }

    console.log('Emitting new-checkin event:', { eventId, eventPath, userName });

    // Emit the event-checkin event to all connected clients
    io.emit('new-checkin', {
      eventId,
      eventPath,
      userName,
      timestamp: new Date().toISOString(),
    });

    console.log('Event emitted successfully');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error emitting socket event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
