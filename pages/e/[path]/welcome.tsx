import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
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
import Confetti from 'react-confetti';
import { useWindowSize } from 'utils/hooks';

interface WelcomeProps {
  event: PartialEvent;
  previousEvent: PartialEvent | null;
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

// Helper function to determine if a user is an active supporter
const isActiveSupporter = (user: PartialUser): boolean => {
  return (
    user.subscriptions?.some(sub => {
      const lastPaymentDate = new Date(sub.lastPaymentDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return lastPaymentDate >= oneYearAgo;
    }) ?? false
  );
};

const WelcomePage = ({ event, previousEvent }: WelcomeProps) => {
  console.log('previousEvent', previousEvent);
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
  const [isSupporter, setIsSupporter] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio element

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

    setWelcomeMessage(`Welcome ${nextWelcome.name?.split(' ')[0]}!`);
    setIsSupporter(nextWelcome.isSupporter);
    setIsShowingWelcome(true);

    // Play applause sound only for supporters
    if (nextWelcome.isSupporter && audioRef.current) {
      audioRef.current.play();
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to stop sound after 10 seconds
    if (nextWelcome.isSupporter && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset audio to start
        }
      }, 10000);
    }

    // Set timeout to clear the message after 15 seconds
    timeoutRef.current = setTimeout(() => {
      setIsShowingWelcome(false);
      setWelcomeMessage('');

      // Check if there are more messages in the queue
      if (welcomeQueueRef.current.length > 0) {
        showNextWelcome();
      }
    }, 15000); // Keep message for 15 seconds, applause will stop after 10 within this time.
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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const eventStartDate = previousEvent?.startDate ? new Date(previousEvent.startDate) : yesterday;

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
      } else if (isActiveSupporter(user)) {
        groups.supporters.push(user);
      } else {
        groups.friends.push(user);
      }
    });

    setGroupedAttendees(groups);
  };

  // Add this function to handle user avatar clicks
  const handleUserClick = (user: PartialUser) => {
    // Create a check-in notification for the clicked user
    const userName = user.displayName || user.name || '';
    const isUserSupporter = isActiveSupporter(user);

    // Clear existing queue and timeout
    welcomeQueueRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsShowingWelcome(false);
    setWelcomeMessage('');

    const clickedUserCheckin: CheckinNotification = {
      id: user.id.toString(),
      name: userName,
      isSupporter: isUserSupporter,
    };

    // Add to welcome queue
    welcomeQueueRef.current.push(clickedUserCheckin);

    // Show the welcome message for the clicked user
    showNextWelcome();
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
            console.log('newUser', newUser);
            // Check if user is a supporter
            const isSupporter = isActiveSupporter(newUser);
            console.log('isSupporter', isSupporter);

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
        overflow: { xs: 'auto', sm: 'hidden' }, // Allow scrolling on xs screens, hide overflow on larger screens
        boxSizing: 'border-box', // Ensure padding is included in height calculation
      }}
    >
      {/* Header - Shows either the event name or welcome message */}
      <Box
        sx={{
          height: { xs: 'auto', sm: '100px', md: '120px' },
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mt: { xs: 2, sm: 6, md: 0 },
          mb: { xs: 2, sm: 0 },
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
        {isShowingWelcome && isSupporter ? (
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
          marginTop: { xs: 10, md: 0 },
          gap: { xs: 0, md: 0 },
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
            maxWidth: { xs: '100%', md: '45%' },
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
              height: { xs: 'auto', md: '82%' },
            }}
          >
            <Typography
              variant='h4'
              sx={{
                color: '#486e62',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.1rem' },
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
              height: { md: '82%' },
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
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.1rem' },
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
                }}
              >
                ({attendees.length})
              </Typography>
            </Typography>

            {/* Content Area - Attendees List */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                mt: { xs: 2, sm: 3 },
                overflowY: { xs: 'visible', sm: 'auto' }, // Allow content to extend on xs, scroll on larger screens
                minHeight: { xs: 'auto', sm: 0 }, // Auto height on xs, controlled by flex on larger screens
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
                    onUserClick={handleUserClick}
                  />
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.friends}
                    label='Friends and Allies'
                    baseColor={GROUP_COLORS.friends}
                    onUserClick={handleUserClick}
                  />
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.supporters}
                    label='Supporting Members'
                    baseColor={GROUP_COLORS.supporters}
                    onUserClick={handleUserClick}
                  />
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.coreTeam}
                    label='Core Team'
                    baseColor={GROUP_COLORS.coreTeam}
                    onUserClick={handleUserClick}
                  />
                  <UserAvatarsRowWithLabel
                    users={groupedAttendees.execTeam}
                    label='Exec Team'
                    baseColor={GROUP_COLORS.execTeam}
                    onUserClick={handleUserClick}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
      {isShowingWelcome && isSupporter && (
        <Confetti width={width} height={height} recycle={true} numberOfPieces={200} gravity={0.1} tweenDuration={10000} />
      )}
      <audio ref={audioRef} src='/applause.mp3' /> {/* Audio element */}
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

    const previousEvent = await prisma.event.findFirst({
      where: { id: { not: event.id }, startDate: { lt: event.startDate } },
      orderBy: { startDate: 'desc' },
    });
    if (previousEvent) {
      formatServerProps(previousEvent);
    }
    return { props: { event, previousEvent } };
  } catch (err) {
    return {
      props: {
        event: null,
        previousEvent: null,
      },
    };
  }
}

export default WelcomePage;
