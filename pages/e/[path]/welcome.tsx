import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { io, Socket } from 'socket.io-client';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { prisma } from 'utils/prisma/init';
import formatServerProps from 'utils/api/format-server-props';
import { PartialEvent, PartialUser } from 'interfaces';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import axios from 'axios';
import Attendee from 'components/event/Attendee';

interface WelcomeProps {
  event: PartialEvent;
}

interface CheckinNotification {
  userName: string;
  timestamp: string;
  eventPath: string;
}

interface CheckinData {
  id: number;
  user: {
    id: number;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt?: string;
}

const WelcomePage = ({ event }: WelcomeProps) => {
  const router = useRouter();
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isShowingWelcome, setIsShowingWelcome] = useState<boolean>(false);
  const [recentCheckins, setRecentCheckins] = useState<CheckinNotification[]>([]);
  const [attendees, setAttendees] = useState<PartialUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const welcomeQueueRef = useRef<CheckinNotification[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch existing check-ins when the page loads
  useEffect(() => {
    const fetchExistingCheckins = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching attendees for event:', event.id);
        console.log('Event organizers:', event.organizers);

        // Use the same endpoint as the checkin page to get complete user data with roles
        const response = await axios.get(`/api/events/${event.id}/attendees`);

        if (response.data && Array.isArray(response.data)) {
          console.log('Received attendees data:', response.data);

          // Process the attendees to ensure organizer roles are properly set
          const processedAttendees = response.data.map((user: PartialUser) => {
            // Create a copy of the user to avoid modifying the original
            const processedUser = { ...user };

            // Initialize roles array if it doesn't exist
            if (!processedUser.roles) {
              processedUser.roles = [];
            }

            // Check if user is an organizer and add the role if not already present
            const isOrganizer = event.organizers?.some(organizer => organizer.id === user.id);
            if (isOrganizer && !processedUser.roles.some(role => role.name === 'Organizer')) {
              processedUser.roles.push({ name: 'Organizer' });
            }

            // Check if user is staff (email ends with @treefolks.org)
            const isStaff =
              (user.email && user.email.endsWith('@treefolks.org')) || (user.email2 && user.email2.endsWith('@treefolks.org'));

            if (isStaff && !processedUser.roles.some(role => role.name === 'Staff')) {
              processedUser.roles.push({ name: 'Staff' });
            }

            return processedUser;
          });

          // The attendees endpoint already returns properly formatted users with roles
          setAttendees(processedAttendees.slice(0, 20));

          // Also format for the welcome message display
          const formattedCheckins = processedAttendees.map((user: PartialUser) => ({
            userName: user.displayName || user.name || '',
            timestamp: new Date().toISOString(), // We don't have timestamp in this response
            eventPath: event.path,
          }));
          setRecentCheckins(formattedCheckins.slice(0, 20));
        } else {
          // Fallback to the checkin-list endpoint if attendees endpoint fails
          console.log('Attendees endpoint returned invalid data, falling back to checkin-list');
          const fallbackResponse = await axios.get(`/api/events/${event.id}/checkin-list`);
          if (fallbackResponse.data && Array.isArray(fallbackResponse.data.checkins)) {
            // Format for the welcome message display
            const formattedCheckins = fallbackResponse.data.checkins.map((checkin: CheckinData) => ({
              userName: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
              timestamp: checkin.createdAt || new Date().toISOString(),
              eventPath: event.path,
            }));
            setRecentCheckins(formattedCheckins.slice(0, 20));

            // Format for the attendee component display
            const formattedAttendees: PartialUser[] = fallbackResponse.data.checkins.map((checkin: CheckinData) => {
              // Create a basic user object
              const user: PartialUser = {
                id: checkin.user.id,
                name: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
                displayName: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
                roles: [],
              };

              // Check if user is an organizer
              if (event.organizers?.some(organizer => organizer.id === user.id)) {
                user.roles.push({ name: 'Organizer' });
              }

              return user;
            });
            setAttendees(formattedAttendees.slice(0, 20));
          }
        }
      } catch (error) {
        console.error('Error fetching existing check-ins:', error);
        // Try the fallback endpoint if the first one fails
        try {
          console.log('Error with attendees endpoint, falling back to checkin-list');
          const fallbackResponse = await axios.get(`/api/events/${event.id}/checkin-list`);
          if (fallbackResponse.data && Array.isArray(fallbackResponse.data.checkins)) {
            // Process as in the fallback case above
            const formattedCheckins = fallbackResponse.data.checkins.map((checkin: CheckinData) => ({
              userName: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
              timestamp: checkin.createdAt || new Date().toISOString(),
              eventPath: event.path,
            }));
            setRecentCheckins(formattedCheckins.slice(0, 20));

            const formattedAttendees: PartialUser[] = fallbackResponse.data.checkins.map((checkin: CheckinData) => {
              const user: PartialUser = {
                id: checkin.user.id,
                name: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
                displayName: `${checkin.user.firstName || ''} ${checkin.user.lastName || ''}`.trim(),
                roles: [],
              };

              // Check if user is an organizer
              if (event.organizers?.some(organizer => organizer.id === user.id)) {
                user.roles.push({ name: 'Organizer' });
              }

              return user;
            });
            setAttendees(formattedAttendees.slice(0, 20));
          }
        } catch (fallbackError) {
          console.error('Error with fallback fetch:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (event?.id) {
      fetchExistingCheckins();
    }
  }, [event]);

  // Connect to socket.io server
  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      try {
        console.log('Initializing socket connection...');
        // Make sure the socket server is running
        await fetch('/api/socket');

        // Connect to the socket server with the correct path
        const socketInstance = io({
          path: '/api/socket',
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
          console.log('Socket connected successfully with ID:', socketInstance.id);
        });

        socketInstance.on('connect_error', err => {
          console.error('Socket connection error:', err);
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    socketInitializer();

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle new check-ins
  useEffect(() => {
    if (!socket) return;

    const handleNewCheckin = (data: CheckinNotification) => {
      console.log('New check-in received:', data);

      // Only process check-ins for this event
      if (data.eventPath === router.query.path) {
        console.log('Check-in is for this event, processing...');
        welcomeQueueRef.current.push(data);

        // Add to recent checkins list
        setRecentCheckins(prev => {
          const newCheckins = [data, ...prev];
          // Keep only the most recent 20 check-ins
          return newCheckins.slice(0, 20);
        });

        // Add to attendees list for Attendee component
        setAttendees(prev => {
          const newAttendee: PartialUser = {
            id: Date.now(), // Use timestamp as temporary ID
            name: data.userName,
            displayName: data.userName,
            // Check if this might be an organizer based on name matching
            // This is a simplistic approach - ideally we'd have the user ID to check properly
            roles: event.organizers?.some(
              organizer =>
                organizer.name?.toLowerCase() === data.userName.toLowerCase() ||
                organizer.displayName?.toLowerCase() === data.userName.toLowerCase(),
            )
              ? [{ name: 'Organizer' }]
              : [],
          };
          const newAttendees = [newAttendee, ...prev];
          // Keep only the most recent 20 attendees
          return newAttendees.slice(0, 20);
        });

        // If we're not currently showing a welcome message, show this one
        if (!isShowingWelcome) {
          showNextWelcome();
        }
      } else {
        console.log('Check-in is for a different event, ignoring.');
      }
    };

    console.log('Setting up new-checkin event listener');
    socket.on('new-checkin', handleNewCheckin);

    return () => {
      console.log('Removing new-checkin event listener');
      socket.off('new-checkin', handleNewCheckin);
    };
  }, [socket, isShowingWelcome, router.query.path, event.organizers]);

  // Function to show the next welcome message in the queue
  const showNextWelcome = () => {
    if (welcomeQueueRef.current.length === 0) {
      setIsShowingWelcome(false);
      return;
    }

    const nextWelcome = welcomeQueueRef.current.shift();
    setWelcomeMessage(`Welcome ${nextWelcome.userName}`);
    setIsShowingWelcome(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to clear the message after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsShowingWelcome(false);
      setWelcomeMessage('');

      // Check if there are more messages in the queue
      if (welcomeQueueRef.current.length > 0) {
        showNextWelcome();
      }
    }, 5000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{
        height: '100vh', // Use full viewport height
        width: '100%',
        bgcolor: '#486e62', // Primary green color
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        boxSizing: 'border-box', // Ensure padding is included in height calculation
      }}
    >
      {/* Header */}
      <Typography
        variant='h2'
        component='h1'
        sx={{
          color: 'white',
          textAlign: 'center',
          mb: { xs: 2, md: 4 },
          fontWeight: 'bold',
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
        }}
      >
        {parsedEvent.name}
      </Typography>

      <Container
        maxWidth='xl'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1, // Take up remaining space
          height: { xs: 'auto', md: 'calc(100vh - 150px)' }, // Adjust for header and padding
          gap: { xs: 4, md: 2 },
        }}
      >
        {/* QR Code Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'auto', md: '100%' },
            mb: { xs: 4, md: 0 },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: 'white',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: { md: '90%' },
              width: { xs: '300px', md: '350px', lg: '400px' },
              height: { xs: 'auto', md: '80%' },
            }}
          >
            <Typography
              variant='h4'
              sx={{
                color: '#486e62',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              }}
            >
              Scan to Check In
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Image
                src='/qrcode-checkin.png'
                alt='QR Code for Check-in'
                width={350}
                height={350}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                }}
                priority
              />
            </Box>
          </Paper>
        </Box>

        {/* Center Section - Welcome Message */}
        <Box
          sx={{
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: '200px', md: '100%' },
          }}
        >
          {isShowingWelcome && (
            <Typography
              variant='h2'
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                animation: 'fadeIn 1s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
              }}
            >
              {welcomeMessage}
            </Typography>
          )}
        </Box>

        {/* Recent Check-ins Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'auto', md: '100%' },
            mt: { xs: 4, md: 0 },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              bgcolor: 'white',
              borderRadius: 2,
              width: '100%',
              maxWidth: '350px',
              height: { md: '80%' }, // Use most of the available height
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden', // Hide overflow at the paper level
            }}
          >
            <Typography
              variant='h4'
              sx={{
                color: '#486e62',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              }}
            >
              Recent Check-ins
            </Typography>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flex: 1 }}>
                <CircularProgress size={40} sx={{ color: '#486e62' }} />
              </Box>
            ) : attendees.length === 0 ? (
              <Typography
                variant='body2'
                sx={{
                  textAlign: 'center',
                  color: 'gray',
                  fontStyle: 'italic',
                  py: 2,
                  flex: 1,
                }}
              >
                No check-ins yet
              </Typography>
            ) : (
              <Box sx={{ width: '100%', px: 1, flex: 1, overflow: 'auto' }}>
                {attendees.map((attendee, index) => (
                  <Box key={attendee.id || index} sx={{ mb: 2 }}>
                    <Attendee user={attendee} hideContactPageIcon={true} />
                    {index < attendees.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    const event = await prisma.event.findFirst({
      where: { path: path + '' },
      include: {
        categories: { include: { trees: {} } },
        location: {},
        organizers: {
          select: {
            id: true,
            name: true,
            displayName: true,
            email: true,
            email2: true,
            roles: true,
          },
        },
      },
    });

    if (!event) {
      return {
        notFound: true,
      };
    }

    formatServerProps(event);

    return { props: { event } };
  } catch (err) {
    console.log('err', err);
    return {
      props: {
        event: null,
      },
    };
  }
}

export default WelcomePage;
