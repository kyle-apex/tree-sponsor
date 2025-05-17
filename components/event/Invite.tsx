import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields, PartialUser, PartialEventRSVP } from 'interfaces';
import { SetStateAction, useEffect, useRef, useState, MouseEvent } from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LocationMapDialog from './LocationMapDialog';
import formatDateString from 'utils/formatDateString';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import Image from 'next/image';
import UserBubbles from './UserBubbles';
import SplitRow from 'components/layout/SplitRow';
import { UserAvatar } from 'components/sponsor';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import LinkIcon from '@mui/icons-material/Link';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Place } from '@mui/icons-material';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import ExpandCollapseSection from 'components/layout/ExpandCollapseSection';
import { useGet } from 'utils/hooks/use-get';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import axios from 'axios';
import InviteRSVPDialog from './InviteRSVPDialog';
import GuestListDialog from './GuestListDialog';

const EventInvite = ({
  event,
  invitedByUser,
  name,
  email,
}: {
  event?: PartialEvent;
  invitedByUser?: PartialUser;
  name?: string;
  email?: string;
}) => {
  console.log('name', name, 'email', email);
  const [storedEmail, setStoredEmail] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const [storedUser, setStoredUser] = useState<PartialUser>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventRSVP, setEventRSVP] = useState<PartialEventRSVP>();
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const [isGuestListDialogOpen, setIsGuestListDialogOpen] = useState(false);
  const [isLocationMapDialogOpen, setIsLocationMapDialogOpen] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('Going');
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Use localStorage to store RSVP data for this specific event
  const {
    data: rsvps,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialEventRSVP[]>(`/api/events/${event.id}/rsvps`, `events/${event.id}/rsvps`, null);

  const getUserData = async (email: string) => {
    const results: any = await axios.get(`/api/events/${event.id}/rsvps?email=${email}`);
    const { rsvp, user }: { rsvp: PartialEventRSVP; user: PartialUser } = results?.data;

    if (rsvp) {
      setEventRSVP(rsvp);
    }
    setStoredUser(user);
  };

  useEffect(() => {
    if (storedEmail) {
      getUserData(storedEmail);
    }
  }, [storedEmail]);

  // Function to save RSVP to localStorage and refresh the guest list
  const handleRSVPSubmit = (rsvpData: PartialEventRSVP) => {
    setEventRSVP(rsvpData);
    if (!storedEmail && rsvpData.email) setStoredEmail(rsvpData.email);
    // Refresh the rsvps data to update the guest list count
    refetch();
  };

  // Calendar link generation functions
  const generateGoogleCalendarLink = (event: PartialEvent) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1.5); // Assuming 1.5 hour event duration

    const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name,
    )}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(
      event.location.name,
    )}`;
  };

  const generateOutlookCalendarLink = (event: PartialEvent) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1.5); // Assuming 1.5 hour event duration

    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      event.name,
    )}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(
      event.description || '',
    )}&location=${encodeURIComponent(event.location.name)}`;
  };

  const generateYahooCalendarLink = (event: PartialEvent) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1.5); // Assuming 1.5 hour event duration

    const yahooStartDate = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const yahooEndDate = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
      event.name,
    )}&st=${yahooStartDate}&et=${yahooEndDate}&desc=${encodeURIComponent(event.description || '')}&in_loc=${encodeURIComponent(
      event.location.name,
    )}`;
  };

  // This function is used on line 412, so we need to keep it
  const generateICalendarLink = (_event: PartialEvent) => {
    // For iCal, we would typically generate a .ics file
    // This is a simplified version that would need server-side implementation
    // For now, we'll just return a placeholder
    return '#';
  };

  return (
    <>
      <Box sx={{ textAlign: 'left', mt: -1 }} mb={2}>
        <img
          style={{
            width: 'calc(100% + 40px)',
            marginLeft: '-20px',
            marginTop: '-2px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
          src={event.pictureUrl}
        ></img>
        {false && event.organizers?.length > 0 && (
          <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px' }} mb={1}>
            <UserAvatar image={event.organizers[0].image} name={event.organizers[0].name} size={16}></UserAvatar>
            <Typography variant='body2' color='gray' sx={{ fontStyle: 'italic' }}>
              {event.organizers[0].name} invited you to:
            </Typography>
          </Box>
        )}
        <Typography variant='subtitle1' color='secondary' sx={{ lineHeight: 'normal', fontWeight: 600, fontSize: '1.4rem' }} mb={2} mt={1}>
          {event.name}
        </Typography>
        <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px', marginTop: '8px', marginBottom: '4px' }}>
          <InsertInvitationIcon sx={{ fontSize: '14x', color: 'gray' }}></InsertInvitationIcon>
          <Typography variant='subtitle2' sx={{ fontSize: '1rem' }}>
            {formatDateString(event?.startDate)}, 6:30-8pm
          </Typography>
        </Box>
        <Box
          flexDirection='row'
          alignItems='center'
          style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}
          onClick={() => setIsLocationMapDialogOpen(true)}
        >
          <PlaceIcon sx={{ fontSize: '14x', color: 'gray' }}></PlaceIcon>
          <Typography variant='subtitle2' sx={{ fontSize: '1rem', textDecoration: 'underline' }}>
            {event.location.name}
          </Typography>
        </Box>
      </Box>
      {event.organizers?.length > 0 && (
        <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px' }}>
          <Typography whiteSpace='nowrap'>Hosted By:</Typography>
          <UserBubbles users={event.organizers} maxLength={3} size={28} />
          <Typography color='gray' variant='body2'>
            {event.organizers[0].name}
            {event.organizers.length > 1 ? ` and ${event.organizers.length - 1} others` : ''}
          </Typography>
        </Box>
      )}
      <Box
        sx={{ border: 'solid 2px', borderRadius: '5px', borderColor: theme => theme.palette.primary.main, padding: '10px' }}
        className='box-shadow'
        mt={2}
      >
        <Box>
          <SplitRow>
            <Typography>
              {rsvps?.filter(r => r.status === 'Going')?.length || 0} Going {rsvps?.filter(r => r.status === 'Maybe')?.length || 0} Maybe
            </Typography>
            <a style={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsGuestListDialogOpen(true)}>
              View Guest List
            </a>
          </SplitRow>
        </Box>
        <hr />
        {rsvps && rsvps.length > 0 && (
          <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '10px' }}>
            <UserBubbles ml={-1.4} users={rsvps.map(r => r.user).filter(Boolean)} maxLength={6} size={24} />
            <Typography color='gray' variant='body2'>
              {rsvps[0]?.user?.name && rsvps[1]?.user?.name
                ? (() => {
                    const othersCount = rsvps.length - 2;
                    if (othersCount > 0) {
                      return `${rsvps[0].user.name}, ${rsvps[1].user.name}, and ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`;
                    }
                    return `${rsvps[0].user.name}, ${rsvps[1].user.name}`;
                  })()
                : rsvps[0]?.user?.name
                ? rsvps[0].user.name
                : 'No attendees yet'}
            </Typography>
          </Box>
        )}
        {!eventRSVP && (
          <Typography sx={{ mt: 2, mb: 2 }}>
            {invitedByUser?.name ? invitedByUser.name : 'TreeFolksYP'} invited you to {event.name} on {formatDateString(event?.startDate)}{' '}
            6:30-8pm:
          </Typography>
        )}
        {eventRSVP ? (
          // Display RSVP status and change response button
          <Box>
            <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                {eventRSVP.status === 'Going'
                  ? '🎉 You are going!'
                  : eventRSVP.status === 'Maybe'
                  ? '🤷 You responded Maybe'
                  : eventRSVP.status === 'Declined'
                  ? '😔 You declined'
                  : 'You responded'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {eventRSVP.user?.name
                  ? `Responded as ${eventRSVP.user.name}`
                  : eventRSVP.email
                  ? `Responded with email ${eventRSVP.email}`
                  : ''}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={() => {
                setRsvpStatus(eventRSVP.status as string);
                setIsRSVPDialogOpen(true);
              }}
            >
              Change Response
            </Button>

            {/* Show "Want to help spread the word?" section only for Going or Maybe responses */}
            {(eventRSVP.status === 'Going' || eventRSVP.status === 'Maybe') && (
              <Box
                sx={{
                  mt: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Header with gradient background */}
                <Box
                  sx={{
                    background: theme => `radial-gradient(circle at -50% -50%, #1b2b1c 0%, ${theme.palette.primary.main} 70%)`,
                    padding: 2,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 'bold', color: 'white' }}>
                    Want to help spread the word?
                  </Typography>
                </Box>

                {/* Content section */}
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {/* Define common styles for all grid items */}
                    {(() => {
                      // Common styles for all Paper components
                      const commonPaperStyles = {
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        height: '100%',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: (theme: Theme) => `${theme.palette.primary.main}10`,
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      };

                      // Additional styles for link items
                      const linkStyles = {
                        ...commonPaperStyles,
                        textDecoration: 'none',
                        color: 'inherit',
                      };

                      // Common icon styles
                      const iconStyles = { fontSize: 40, mb: 1 };

                      // Common typography styles
                      const typographyStyles = { fontWeight: 400, fontSize: '.8rem', color: 'text.secondary' };

                      // Grid item definitions
                      const gridItems = [
                        {
                          icon: <EventIcon color='primary' sx={iconStyles} />,
                          text: 'Add to Calendar',
                          onClick: (e: MouseEvent<HTMLElement>) => setCalendarAnchorEl(e.currentTarget),
                          component: 'div' as React.ElementType | undefined,
                          href: undefined as string | undefined,
                        },
                        {
                          icon: <LinkIcon color='primary' sx={iconStyles} />,
                          text: 'Copy Invite Link',
                          onClick: () => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(window.location.href);
                              setSnackbarOpen(true);
                            }
                          },
                          component: undefined,
                          href: undefined,
                        },
                        {
                          icon: <ThumbUpIcon color='primary' sx={iconStyles} />,
                          text: 'Upvote on do512',
                          onClick: undefined,
                          component: 'a',
                          href: 'https://do512.tfyp.org',
                        },
                        {
                          icon: <MeetingRoomIcon color='primary' sx={iconStyles} />,
                          text: 'RSVP on Meetup.com',
                          onClick: undefined,
                          component: 'a',
                          href: 'https://meetup.tfyp.org',
                        },
                      ];

                      return gridItems.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Paper
                            elevation={2}
                            component={item.component}
                            href={item.href}
                            target={item.href ? '_blank' : undefined}
                            rel={item.href ? 'noopener noreferrer' : undefined}
                            sx={item.href ? (linkStyles as SxProps<Theme>) : (commonPaperStyles as SxProps<Theme>)}
                            onClick={item.onClick}
                          >
                            {item.icon}
                            <Typography variant='body1' align='center' sx={typographyStyles}>
                              {item.text}
                            </Typography>
                          </Paper>
                        </Grid>
                      ));
                    })()}
                  </Grid>

                  {/* Calendar dropdown menu */}
                  <Menu anchorEl={calendarAnchorEl} open={Boolean(calendarAnchorEl)} onClose={() => setCalendarAnchorEl(null)}>
                    <MenuItem
                      onClick={() => {
                        window.open(generateGoogleCalendarLink(event), '_blank');
                        setCalendarAnchorEl(null);
                      }}
                    >
                      Google Calendar
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        window.open(generateOutlookCalendarLink(event), '_blank');
                        setCalendarAnchorEl(null);
                      }}
                    >
                      Outlook Calendar
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        window.open(generateYahooCalendarLink(event), '_blank');
                        setCalendarAnchorEl(null);
                      }}
                    >
                      Yahoo Calendar
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        window.open(generateICalendarLink(event), '_blank');
                        setCalendarAnchorEl(null);
                      }}
                    >
                      iCalendar (.ics)
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          // Display RSVP buttons if no RSVP exists
          <>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              sx={{ mb: 1.5 }}
              onClick={() => {
                setRsvpStatus('Going');
                setIsRSVPDialogOpen(true);
              }}
            >
              Accept Invite
            </Button>
            <SplitRow gap={1}>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={() => {
                  setRsvpStatus('Maybe');
                  setIsRSVPDialogOpen(true);
                }}
              >
                Maybe
              </Button>
              <Button
                fullWidth
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setRsvpStatus('Declined');
                  setIsRSVPDialogOpen(true);
                }}
              >
                Decline
              </Button>
            </SplitRow>
          </>
        )}
      </Box>
      {event.description && (
        <Box sx={{ mt: 3 }}>
          <Typography>Event Details:</Typography>
          <Typography variant='body2' color='gray'>
            <ExpandCollapseSection maxHeight={200}>
              <SafeHTMLDisplay html={event.description}></SafeHTMLDisplay>
            </ExpandCollapseSection>
          </Typography>
        </Box>
      )}
      <InviteRSVPDialog
        event={event}
        initialEmail={storedEmail}
        initialName={storedUser?.name}
        isOpen={isRSVPDialogOpen}
        setIsOpen={(open: boolean) => {
          setIsRSVPDialogOpen(open);
          if (!open) {
            setIsSignInMode(false);
          }
        }}
        invitedByUser={invitedByUser}
        isSignIn={isSignInMode}
        initialStatus={eventRSVP?.status || rsvpStatus}
        onRSVPSubmit={handleRSVPSubmit}
      />
      <GuestListDialog
        open={isGuestListDialogOpen}
        onClose={() => setIsGuestListDialogOpen(false)}
        hasRSVP={!!eventRSVP}
        users={[
          // Going users first
          ...(rsvps
            ?.filter(r => r.status === 'Going')
            .map(r => r.user)
            .filter(Boolean) || []),
          // Maybe users next
          ...(rsvps
            ?.filter(r => r.status === 'Maybe')
            .map(r => r.user)
            .filter(Boolean) || []),
        ]}
        goingCount={rsvps?.filter(r => r.status === 'Going')?.length || 0}
        maybeCount={rsvps?.filter(r => r.status === 'Maybe')?.length || 0}
        onRSVP={() => {
          setIsGuestListDialogOpen(false);
          setIsRSVPDialogOpen(true);
        }}
        onSignIn={() => {
          setIsGuestListDialogOpen(false);
          setIsSignInMode(true);
          setIsRSVPDialogOpen(true);
        }}
      />
      <LocationMapDialog open={isLocationMapDialogOpen} onClose={() => setIsLocationMapDialogOpen(false)} location={event.location} />
      <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity='success' color='info' sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventInvite;
