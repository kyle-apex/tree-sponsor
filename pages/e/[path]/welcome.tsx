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

interface CheckinData {
  id: number;
  user: {
    id: number;
    name?: string;
    firstName?: string;
    lastName?: string;
    roles?: { name: string }[];
  };
  createdAt?: string;
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
  const router = useRouter();
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isShowingWelcome, setIsShowingWelcome] = useState<boolean>(false);
  const [recentCheckins, setRecentCheckins] = useState<CheckinNotification[]>([]);
  const [attendees, setAttendees] = useState<PartialUser[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [correctQuizResponses, setCorrectQuizResponses] = useState<number>(0);
  const welcomeQueueRef = useRef<CheckinNotification[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const quizStatsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attendeesRef = useRef<PartialUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [groupedAttendees, setGroupedAttendees] = useState<GroupedAttendees>(INITIAL_GROUPS);

  // Function to show the next welcome message in the queue
  const showNextWelcome = () => {
    if (welcomeQueueRef.current.length === 0) {
      console.log('No welcome messages in queue');
      setIsShowingWelcome(false);
      return;
    }

    const nextWelcome = welcomeQueueRef.current.shift();
    console.log(`Showing welcome message for: ${nextWelcome.name}`);
    setWelcomeMessage(`Welcome ${nextWelcome.name}`);
    setIsShowingWelcome(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to clear the message after 5 seconds
    timeoutRef.current = setTimeout(() => {
      console.log('Welcome message timeout expired');
      setIsShowingWelcome(false);
      setWelcomeMessage('');

      // Check if there are more messages in the queue
      if (welcomeQueueRef.current.length > 0) {
        console.log(`${welcomeQueueRef.current.length} more welcome messages in queue`);
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
      console.log('Fetching attendees for event:', event.id);
      // Only set loading state on initial load, no loading state for refreshes

      // Use the attendees endpoint without providing an email to get all check-ins sorted by time
      const response = await axios.get(`/api/events/${event.id}/attendees`);

      console.log('API response:', response.data);

      if (response.data && response.data.attendees && Array.isArray(response.data.attendees)) {
        const attendeesList = response.data.attendees;
        console.log('Received attendees data, count:', attendeesList.length);

        // Ensure each attendee has the required properties for the Attendee component
        const processedAttendees = attendeesList.map((user: PartialUser) => {
          if (!user.roles) {
            user.roles = [];
          }
          return user;
        });

        // Update attendees state - attendees are already sorted by check-in time from the API
        setAttendees(processedAttendees);
        groupAttendees(processedAttendees);

        // Also format for the welcome message display
        const formattedCheckins = processedAttendees.map((user: PartialUser) => ({
          id: user.id.toString(),
          name: user.displayName || user.name || '',
        }));
        setRecentCheckins(formattedCheckins.slice(0, 20));
        setLastCheckTime(new Date().toISOString());

        // Check for new attendees
        if (attendees.length > 0) {
          const existingIds = new Set(attendees.map(a => a.id));
          const newAttendees = processedAttendees.filter((a: PartialUser) => !existingIds.has(a.id));

          console.log(`Found ${newAttendees.length} new attendees since last check`);

          // Process new check-ins for welcome messages
          newAttendees.forEach((newUser: PartialUser) => {
            const userName = newUser.displayName || newUser.name || '';
            console.log(`Adding new check-in to welcome queue: ${userName}`);

            // Check if user is a supporter
            const isSupporter = newUser.roles?.some(role => role.name === 'Supporter') || false;
            if (isSupporter) {
              console.log(`${userName} is a supporting member!`);
            }

            const newCheckin: CheckinNotification = {
              id: newUser.id.toString(),
              name: userName,
              isSupporter,
            };

            // Add to welcome queue
            welcomeQueueRef.current.push(newCheckin);
          });

          // If we have new attendees and we're not currently showing a welcome message, show one
          if (newAttendees.length > 0 && !isShowingWelcome) {
            console.log('Triggering welcome message display');
            showNextWelcome();
          }
        } else {
          console.log('First load - no existing attendees to compare against');
        }
      } else {
        console.error('Attendees endpoint returned invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Fetch quiz stats
  const fetchQuizStats = async () => {
    try {
      console.log('Fetching quiz stats for event:', event.id);
      const response = await axios.get(`/api/events/${event.id}/quiz-stats`);

      if (response.data && typeof response.data.correctResponsesCount === 'number') {
        console.log('Received quiz stats:', response.data);
        setCorrectQuizResponses(response.data.correctResponsesCount);
      } else {
        console.error('Quiz stats endpoint returned invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
    }
  };

  // Initial fetch of check-ins when the page loads
  useEffect(() => {
    if (event?.id) {
      console.log('Initial fetch of check-ins');
      fetchCheckins();
    }
  }, [event]);

  // Initial fetch of quiz stats when the page loads
  useEffect(() => {
    if (event?.id) {
      console.log('Initial fetch of quiz stats');
      fetchQuizStats();
    }
  }, [event]);

  // Set up polling interval
  useEffect(() => {
    // Start polling for new check-ins every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (event?.id) {
        console.log('Polling for new check-ins...');
        fetchCheckins();
      }
    }, 3000);

    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [event]);

  // Set up polling interval for quiz stats
  useEffect(() => {
    // Start polling for quiz stats every 10 seconds
    quizStatsIntervalRef.current = setInterval(() => {
      if (event?.id) {
        console.log('Polling for quiz stats...');
        fetchQuizStats();
      }
    }, 10000);

    // Clean up on unmount
    return () => {
      if (quizStatsIntervalRef.current) {
        clearInterval(quizStatsIntervalRef.current);
      }
    };
  }, [event]);

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

  // Function to simulate a new check-in for testing
  const simulateNewCheckin = () => {
    console.log('Simulating a new check-in');
    const testUser: PartialUser = {
      id: Date.now(),
      name: 'Test User',
      displayName: 'Test User',
      roles: [{ name: 'Supporter' }],
    };

    // Add to attendees list
    setAttendees(prev => [testUser, ...prev.slice(0, 19)]);

    // Create check-in notification
    const newCheckin: CheckinNotification = {
      id: testUser.id.toString(),
      name: testUser.displayName,
      isSupporter: true,
    };

    // Add to welcome queue
    welcomeQueueRef.current.push(newCheckin);
    console.log('Added test user to welcome queue');

    // Show welcome message if not already showing one
    if (!isShowingWelcome) {
      console.log('Triggering welcome message for test user');
      showNextWelcome();
    }
  };

  // Function to simulate a new member check-in for testing
  const simulateMemberCheckin = () => {
    console.log('Simulating a new member check-in');
    const memberUser: PartialUser = {
      id: Date.now() + 1, // Use timestamp+1 as a unique ID
      name: 'Member User',
      displayName: 'Member User',
      roles: [{ name: 'Supporter' }],
    };

    // Add to attendees list
    setAttendees(prev => [memberUser, ...prev.slice(0, 19)]);

    // Create check-in notification
    const newCheckin: CheckinNotification = {
      id: memberUser.id.toString(),
      name: memberUser.displayName,
      isSupporter: true,
    };

    // Add to welcome queue
    welcomeQueueRef.current.push(newCheckin);
    console.log('Added member user to welcome queue');

    // Show welcome message if not already showing one
    if (!isShowingWelcome) {
      console.log('Triggering welcome message for member user');
      showNextWelcome();
    }
  };

  // Update the processNewCheckins function to correctly check for supporter role
  const processNewCheckins = (newCheckins: CheckinData[]) => {
    console.log(`Processing ${newCheckins.length} new check-ins`);

    newCheckins.forEach((newCheckin: CheckinData) => {
      // Check if this is a new attendee (not in our current list)
      if (!attendeesRef.current.some(a => a.id === newCheckin.user.id)) {
        console.log(`New attendee detected: ${newCheckin.user.name} (${newCheckin.user.id})`);

        // Add to attendees list
        attendeesRef.current = [...attendeesRef.current, newCheckin.user];

        // Check if user has Supporter role
        const isSupporter = newCheckin.user?.roles?.some(role => role.name === 'Supporter') || false;
        console.log(`Is ${newCheckin.user.name} a supporter? ${isSupporter}`);

        // Add to welcome queue
        welcomeQueueRef.current.push({
          id: newCheckin.user.id.toString(),
          name: newCheckin.user.name || '',
          isSupporter: isSupporter,
        });

        // If we're not currently showing a welcome, show one
        if (!isShowingWelcome) {
          console.log('No welcome currently showing, triggering welcome message');
          showNextWelcome();
        }
      }
    });
  };

  // Add keyboard shortcut for test check-in
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Shift+T is pressed
      if (event.shiftKey && event.key === 'T') {
        simulateNewCheckin();
      }
      // Check if Shift+M is pressed
      if (event.shiftKey && event.key === 'M') {
        simulateMemberCheckin();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // For debugging
  useEffect(() => {
    console.log('Current attendees count:', attendees.length);
  }, [attendees]);

  // Function to render an attendee with fallback
  const renderAttendee = (attendee: PartialUser) => {
    try {
      return <Attendee user={attendee} />;
    } catch (error) {
      console.error('Error rendering Attendee component:', error);
      // Fallback UI
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: '#486e62',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {(attendee.displayName || attendee.name || '?').charAt(0).toUpperCase()}
          </Box>
          <Box>
            <Typography variant='body1' sx={{ fontWeight: 500 }}>
              {attendee.displayName || attendee.name || 'Unknown User'}
            </Typography>
            {attendee.roles && attendee.roles.length > 0 && (
              <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.8rem' }}>
                {attendee.roles[0].name}
              </Typography>
            )}
          </Box>
        </Box>
      );
    }
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
            }}
          >
            Thanks for being a supporting member!
          </Typography>
        ) : (
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
            }}
          >
            Correct Tree ID Responses: {correctQuizResponses}
          </Typography>
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
          gap: { xs: 4, md: 4 },
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
              Who's Here{' '}
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
