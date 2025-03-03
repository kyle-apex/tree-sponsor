import { Server as ServerIO } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';

// Extend the NextApiResponse type to include socket property
interface SocketNextApiResponse extends NextApiResponse {
  socket: any;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = async (req: NextApiRequest, res: SocketNextApiResponse) => {
  console.log('Socket handler called');

  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');

    // Get the HTTP server instance
    const httpServer: NetServer = res.socket.server as any;

    // Initialize Socket.IO with CORS settings
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Socket.IO event handling
    io.on('connection', socket => {
      console.log('A client connected with ID:', socket.id);

      socket.on('event-checkin', data => {
        console.log('Event check-in received from client:', data);
        // Broadcast the check-in to all connected clients
        io.emit('new-checkin', data);
        console.log('Broadcasted new-checkin event to all clients');
      });

      socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
      });
    });

    // Store the Socket.IO server instance
    res.socket.server.io = io;
    console.log('Socket.io server initialized successfully');
  } else {
    console.log('Socket.io server already initialized');
  }

  res.end();
};

export default SocketHandler;
