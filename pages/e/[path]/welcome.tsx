import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Button } from '@mui/material';
import Image from 'next/image';
import { prisma } from 'utils/prisma/init';
import formatServerProps from 'utils/api/format-server-props';
import { PartialEvent, PartialUser } from 'interfaces';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import axios from 'axios';
import Attendee from 'components/event/Attendee';
import UserAvatarsRowWithLabel from 'components/UserAvatarsRowWithLabel';

interface WelcomeProps {
  event: PartialEvent;
}

interface CheckinNotification {
  id: string;
  name: string;
  isSupporter?: boolean;
}

interface GroupedAttendees {
  execTeam: PartialUser[];
  coreTeam: PartialUser[];
  newSupporters: PartialUser[];
  supporters: PartialUser[];
  friends: PartialUser[];
}

const INITIAL_GROUPS: GroupedAttendees = {
  execTeam: [],
  coreTeam: [],
  newSupporters: [],
  supporters: [],
  friends: [],
};

// Add these constants at the top of the file after imports
const GROUP_COLORS = {
  execTeam: '#7B1FA2', // Deep Purple
  coreTeam: '#1976D2', // Blue
  newSupporters: '#2E7D32', // Green
  supporters: '#D32F2F', // Red
  friends: '#F57C00', // Orange
};

const WelcomePage = ({ event }: WelcomeProps) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isShowingWelcome, setIsShowingWelcome] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<PartialUser[]>([]);
  const welcomeQueueRef = useRef<CheckinNotification[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attendeesRef = useRef<PartialUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [groupedAttendees, setGroupedAttendees] = useState<GroupedAttendees>(INITIAL_GROUPS);

  // Function to show the next welcome message in the queue
  const showNextWelcome = () => {
    if (welcomeQueueRef.current.length === 0) {
      setIsShowingWelcome(false);
      return;
    }

    const nextWelcome = welcomeQueueRef.current.shift();
    if (!nextWelcome) {
      setIsShowingWelcome(false);
      return;
    }

    setWelcomeMessage(`Welcome ${nextWelcome.name}!`);
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

  // Add this function to group attendees
  const groupAttendees = (attendeesList: PartialUser[]) => {
    const groups: GroupedAttendees = {
      execTeam: [],
      coreTeam: [],
      newSupporters: [],
      supporters: [],
      friends: [],
    };

    const eventStartDate = parsedEvent.startDate ? new Date(parsedEvent.startDate) : new Date();

    attendeesList.forEach(user => {
      if (user.roles?.some(role => role.name === 'Exec Team')) {
        groups.execTeam.push(user);
      } else if (user.roles?.some(role => role.name === 'Core Team')) {
        groups.coreTeam.push(user);
      } else if (
        user.subscriptions?.some(sub => {
          const createdDate = new Date(sub.createdDate);
          return createdDate >= eventStartDate;
        })
      ) {
        groups.newSupporters.push(user);
      } else if (
        user.subscriptions?.some(sub => {
          const lastPaymentDate = new Date(sub.lastPaymentDate);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          return lastPaymentDate >= oneYearAgo;
        })
      ) {
        groups.supporters.push(user);
      } else {
        groups.friends.push(user);
      }
    });

    setGroupedAttendees(groups);
  };

  // Fetch check-ins data
  const fetchCheckins = async () => {
    try {
      const response = await axios.get(`/api/events/${event.id}/attendees`);

      if (response.data && response.data.attendees && Array.isArray(response.data.attendees)) {
        const attendeesList = response.data.attendees;

        // Ensure each attendee has the required properties for the Attendee component
        const processedAttendees = attendeesList.map((user: PartialUser) => {
          if (!user.roles) {
            user.roles = [];
          }
          return user;
        });

        // Check for new attendees before updating state
        const existingIds = new Set(attendeesRef.current.map(a => a.id));
        const newAttendees = processedAttendees.filter((a: PartialUser) => !existingIds.has(a.id));

        // Process new check-ins for welcome messages
        if (newAttendees.length > 0 && !isInitialLoading) {
          newAttendees.forEach((newUser: PartialUser) => {
            const userName = newUser.displayName || newUser.name || '';

            // Check if user is a supporter
            const isSupporter = newUser.roles?.some(role => role.name === 'Supporter') || false;

            const newCheckin: CheckinNotification = {
              id: newUser.id.toString(),
              name: userName,
              isSupporter,
            };

            // Add to welcome queue
            welcomeQueueRef.current.push(newCheckin);
          });

          // If we have new attendees and we're not currently showing a welcome message, show one
          if (!isShowingWelcome && !isInitialLoading) {
            showNextWelcome();
          }
        }

        // Update attendees state and ref
        setAttendees(processedAttendees);
        attendeesRef.current = processedAttendees;
        groupAttendees(processedAttendees);

        // Mark initial load as complete after first successful fetch
        if (isInitialLoading) {
          setIsInitialLoading(false);
        }
      } else {
        console.error('Attendees endpoint returned invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  // Initial fetch of check-ins when the page loads
  useEffect(() => {
    if (event?.id) {
      fetchCheckins();
    }
  }, [event]);

  // Set up polling interval
  useEffect(() => {
    // Start polling for new check-ins every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (event?.id) {
        fetchCheckins();
      }
    }, 3000);

    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [event, isInitialLoading, isShowingWelcome]);

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
      {/* Header - Shows either the event name or welcome message */}
      <Box
        sx={{
          height: { xs: '80px', sm: '100px', md: '120px' }, // Fixed height to prevent layout shift
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', // For absolute positioning of messages
        }}
      >
        {/* Event name - always present but hidden when welcome message is shown */}
        <Typography
          variant='h2'
          component='h1'
          sx={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            opacity: isShowingWelcome ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            position: 'absolute',
            width: '100%',
          }}
        >
          {parsedEvent.name}
        </Typography>

        {/* Welcome message - only visible when active */}
        {isShowingWelcome && (
          <Typography
            variant='h2'
            sx={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              animation: 'fadeIn 1s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              position: 'absolute',
              width: '100%',
              zIndex: 2,
            }}
          >
            {welcomeMessage}
          </Typography>
        )}
      </Box>

      {/* Stats Display - Either Quiz Stats or Supporting Member Message */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {isShowingWelcome && welcomeQueueRef.current.length > 0 && welcomeQueueRef.current[0].isSupporter ? (
          <Typography
            variant='h5'
            sx={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'medium',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              px: 3,
              py: 1,
              animation: 'fadeIn 1s ease-in-out',
              position: 'absolute',
              top: '130px',
            }}
          >
            Thanks for being a supporting member!
          </Typography>
        ) : (
          <></>
        )}
      </Box>

      <Container
        maxWidth='xl'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-around',
          flex: 1,
          height: { xs: 'auto', md: 'calc(100vh - 200px)' },
          gap: { xs: 3, md: 3 },
        }}
      >
        {/* QR Code Section */}
        <Box
          sx={{
            flex: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'auto', md: '100%' },
            mb: { xs: 4, md: 0 },
            maxWidth: { xs: '100%', md: '40%' },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              pt: 4,
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

        {/* Who's Here Section */}
        <Box
          sx={{
            flex: { xs: 1, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'auto', md: '100%' },
            mt: { xs: 4, md: 0 },
            maxWidth: { xs: '100%', md: '55%' },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              bgcolor: 'white',
              borderRadius: 2,
              width: '100%',
              maxWidth: { xs: '350px', md: '500px', lg: '600px' },
              height: { md: '80%' },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pt: 4,
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                minHeight: '2.5rem',
              }}
            >
              Who&apos;s Here{' '}
              <Typography
                component='span'
                sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                  fontWeight: 'normal',
                  display: 'inline-flex',
                  alignItems: 'center',
                  minWidth: '100px',
                }}
              >
                ({attendees.length})
              </Typography>
            </Typography>

            <Box
              sx={{
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '200px',
                position: 'relative',
              }}
            >
              {isInitialLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <CircularProgress size={40} sx={{ color: '#486e62' }} />
                </Box>
              ) : attendees.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <Typography
                    variant='body2'
                    sx={{
                      textAlign: 'center',
                      color: 'gray',
                      fontStyle: 'italic',
                    }}
                  >
                    No check-ins yet
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    px: 1,
                    flex: 1,
                    overflow: 'auto',
                  }}
                >
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.newSupporters}
                    label='New Supporting Members'
                    baseColor={GROUP_COLORS.newSupporters}
                  />
                  <UserAvatarsRowWithLabel users={groupedAttendees.friends} label='Friends and Allies' baseColor={GROUP_COLORS.friends} />
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.supporters}
                    label='Supporting Members'
                    baseColor={GROUP_COLORS.supporters}
                  />
                  <UserAvatarsRowWithLabel users={groupedAttendees.coreTeam} label='Core Team' baseColor={GROUP_COLORS.coreTeam} />
                  <UserAvatarsRowWithLabel users={groupedAttendees.execTeam} label='Exec Team' baseColor={GROUP_COLORS.execTeam} />
                </Box>
              )}
            </Box>
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
            email: false,
            email2: false,
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
    return {
      props: {
        event: null,
      },
    };
  }
}

export default WelcomePage;
