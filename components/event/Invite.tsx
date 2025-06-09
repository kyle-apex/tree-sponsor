import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields, PartialUser, PartialEventRSVP } from 'interfaces';
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import LocationMapDialog from './LocationMapDialog';
import formatDateString from 'utils/formatDateString';
import formatTimeRange from 'utils/formatTimeRange';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import Image from 'next/image';
import UserBubbles from './UserBubbles';
import SplitRow from 'components/layout/SplitRow';
import { UserAvatar } from 'components/sponsor';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LoadingButton from 'components/LoadingButton';
import Divider from '@mui/material/Divider';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PlaceIcon from '@mui/icons-material/Place';
import { Place } from '@mui/icons-material';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import ExpandCollapseSection from 'components/layout/ExpandCollapseSection';
import { useGet } from 'utils/hooks/use-get';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import axios from 'axios';
import InviteRSVPDialog from './InviteRSVPDialog';
import GuestListDialog from './GuestListDialog';
import InvitePostRSVPSection from './InvitePostRSVPSection';
import InvitedPeopleSection from './InvitedPeopleSection';
import InviteDonationSection from './InviteDonationSection';
import RSVPSearchForm from './RSVPSearchForm';
import Grid from '@mui/material/Grid';

const EventInvite = ({
  event,
  invitedByUser,
  email,
}: {
  event?: PartialEvent;
  invitedByUser?: PartialUser;
  name?: string;
  email?: string;
}) => {
  const [storedEmail, setStoredEmail] = useLocalStorage('checkinEmail', email, 'checkinEmail2');
  const [storedUser, setStoredUser] = useState<PartialUser>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventRSVP, setEventRSVP] = useState<PartialEventRSVP>();
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const [isGuestListDialogOpen, setIsGuestListDialogOpen] = useState(false);
  const [isLocationMapDialogOpen, setIsLocationMapDialogOpen] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('Going');
  const [showHostsOnly, setShowHostsOnly] = useState(false);
  const [showUpdateRSVPForm, setShowUpdateRSVPForm] = useState(false);

  // Create hosts array that starts with event.organizers and prioritizes invitedByUser
  const hosts = useMemo(() => {
    if (!event?.organizers?.length) return [];

    // Start with a copy of the organizers array
    const hostsArray = [...event.organizers];

    // If there's no invitedByUser, just return the organizers
    if (!invitedByUser) return hostsArray;

    // Check if invitedByUser is already in the organizers list
    const invitedByUserIndex = hostsArray.findIndex(user => user.id === invitedByUser.id);

    if (invitedByUserIndex === -1) {
      // If invitedByUser is not in the list, add them
      return [invitedByUser, ...hostsArray];
    } else if (invitedByUserIndex > 0) {
      // If invitedByUser is in the list but not first, move them to the front
      const invitedUser = hostsArray.splice(invitedByUserIndex, 1)[0];
      return [invitedUser, ...hostsArray];
    }

    // If invitedByUser is already first in the list, return as is
    return hostsArray;
  }, [event?.organizers, invitedByUser]);

  // Use localStorage to store RSVP data for this specific event
  const {
    data: rsvps,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialEventRSVP[]>(`/api/events/${event.id}/rsvps`, `events/${event.id}/rsvps`, null, { refetchOnWindowFocus: true });

  // Filter RSVPs to only include Going or Maybe responses
  const rsvpsWithoutDeclined = useMemo(() => {
    const filtered = rsvps?.filter(r => r.status === 'Going' || r.status === 'Maybe') || [];

    // If there's no invitedByUser, just return the filtered list
    if (!invitedByUser?.id) return filtered;

    // Sort the list with the following priority:
    // 1. The invitedByUser themselves
    // 2. Users invited by the invitedByUser
    // 3. Everyone else
    return filtered.sort((a, b) => {
      // Check if either RSVP is for the invitedByUser themselves
      const aIsInvitedByUser = a.userId === invitedByUser.id;
      const bIsInvitedByUser = b.userId === invitedByUser.id;

      // Check if either RSVP is for someone invited by the invitedByUser
      const aInvitedByThisUser = a.invitedByUserId === invitedByUser.id;
      const bInvitedByThisUser = b.invitedByUserId === invitedByUser.id;

      // Priority 1: The invitedByUser themselves comes first
      if (aIsInvitedByUser && !bIsInvitedByUser) return -1;
      if (!aIsInvitedByUser && bIsInvitedByUser) return 1;

      // Priority 2: Users invited by the invitedByUser come next
      if (aInvitedByThisUser && !bInvitedByThisUser) return -1;
      if (!aInvitedByThisUser && bInvitedByThisUser) return 1;

      // Otherwise, maintain original order
      return 0;
    });
  }, [rsvps, invitedByUser]);

  const getUserData = async (email: string) => {
    const results: any = await axios.get(`/api/events/${event.id}/rsvps?email=${email}`);
    const { rsvp, user }: { rsvp: PartialEventRSVP; user: PartialUser } = results?.data;

    if (rsvp) {
      setEventRSVP(rsvp);
    }
    setStoredUser(user);
    return { rsvp, user };
  };

  // Helper function to process users for a given status
  const getProcessedUsersForStatus = (status: string) => {
    return (
      rsvps
        ?.filter(r => r.status === status)
        .sort((a: PartialEventRSVP, b: PartialEventRSVP) => {
          if (invitedByUser?.id) {
            // Check if either RSVP is for the invitedByUser themselves
            const aIsInvitedByUser = a.userId === invitedByUser.id;
            const bIsInvitedByUser = b.userId === invitedByUser.id;

            // Check if either RSVP is for someone invited by the invitedByUser
            const aInvitedByThisUser = a.invitedByUserId === invitedByUser.id;
            const bInvitedByThisUser = b.invitedByUserId === invitedByUser.id;

            // Priority 1: The invitedByUser themselves comes first
            if (aIsInvitedByUser && !bIsInvitedByUser) return -1;
            if (!aIsInvitedByUser && bIsInvitedByUser) return 1;

            // Priority 2: Users invited by the invitedByUser come next
            if (aInvitedByThisUser && !bInvitedByThisUser) return -1;
            if (!aInvitedByThisUser && bInvitedByThisUser) return 1;
          }
          return 0;
        })
        .map(r => r.user)
        .filter(Boolean) || []
    );
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
        <Typography variant='subtitle1' color='secondary' sx={{ lineHeight: 'normal', fontWeight: 600, fontSize: '1.4rem' }} mb={2} mt={1}>
          {event.name}
        </Typography>
        <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px', marginTop: '8px', marginBottom: '4px' }}>
          <InsertInvitationIcon sx={{ fontSize: '14x', color: 'gray' }}></InsertInvitationIcon>
          <Typography variant='subtitle2' sx={{ fontSize: '1rem' }}>
            {formatDateString(event?.startDate)}, {event?.startDate ? formatTimeRange(event.startDate, event.endDate) : 'Time TBD'}
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
      {hosts.length > 0 && (
        <Box
          flexDirection='row'
          alignItems='center'
          style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}
          onClick={() => {
            setShowHostsOnly(true);
            setIsGuestListDialogOpen(true);
          }}
        >
          <Typography whiteSpace='nowrap'>Hosted By:</Typography>
          <UserBubbles users={hosts} maxLength={3} size={28} />
          <Typography color='gray' variant='body2'>
            {hosts[0].name}
            {hosts.length > 1 ? ` and ${hosts.length - 1} others` : ''}
          </Typography>
        </Box>
      )}
      <Box
        sx={{ border: 'solid 2px', borderRadius: '5px', borderColor: theme => theme.palette.primary.main, padding: '10px' }}
        className='box-shadow rsvp-button-section'
        mt={2}
      >
        {isFetching ? (
          <>
            <Box>
              <SplitRow>
                <Box>
                  <Skeleton variant='text' width={120} height={24} />
                </Box>
                <Skeleton variant='text' width={100} height={24} />
              </SplitRow>
            </Box>
            <hr />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant='circular' width={24} height={24} />
              <Skeleton variant='circular' width={24} height={24} />
              <Skeleton variant='text' width={100} height={24} />
            </Box>
          </>
        ) : (
          <>
            <Box>
              <SplitRow>
                <Typography>
                  {rsvps?.filter(r => r.status === 'Going')?.length || 0} Going {rsvps?.filter(r => r.status === 'Maybe')?.length || 0}{' '}
                  Maybe
                </Typography>
                <a
                  style={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => {
                    setShowHostsOnly(false);
                    setIsGuestListDialogOpen(true);
                  }}
                >
                  View Guest List
                </a>
              </SplitRow>
            </Box>
            <hr />
            {rsvps && rsvps.length > 0 && (
              <Box
                flexDirection='row'
                alignItems='center'
                style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setShowHostsOnly(false);
                  setIsGuestListDialogOpen(true);
                }}
              >
                <UserBubbles ml={-1.4} users={rsvpsWithoutDeclined.map(r => r.user)} maxLength={6} size={24} />
                <Typography color='gray' variant='body2'>
                  {rsvpsWithoutDeclined[0]?.user?.name && rsvpsWithoutDeclined[1]?.user?.name
                    ? (() => {
                        const othersCount = rsvpsWithoutDeclined.length - 2;
                        if (othersCount > 0) {
                          return `${rsvpsWithoutDeclined[0].user.name}, ${rsvpsWithoutDeclined[1].user.name}, and ${othersCount} ${
                            othersCount === 1 ? 'other' : 'others'
                          }`;
                        }
                        return `${rsvpsWithoutDeclined[0].user.name}, ${rsvpsWithoutDeclined[1].user.name}`;
                      })()
                    : rsvpsWithoutDeclined[0]?.user?.name
                    ? rsvpsWithoutDeclined[0].user.name
                    : 'No attendees yet'}
                </Typography>
              </Box>
            )}
          </>
        )}
        {!eventRSVP && (
          <Typography sx={{ mt: 2, mb: 2 }}>
            {invitedByUser?.name ? invitedByUser.name : 'TreeFolksYP'} invited you to {event.name} on {formatDateString(event?.startDate)}{' '}
            {event?.startDate ? formatTimeRange(event.startDate, event.endDate) : 'Time TBD'}:
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

            {/* Show invited people section only if the user is logged in (has userId) */}
            {eventRSVP?.userId && <InvitedPeopleSection eventId={event.id} currentUserId={eventRSVP.userId} />}
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

            {/* Modify Existing RSVP link and form */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              {!showUpdateRSVPForm ? (
                <Typography
                  variant='body2'
                  color='primary'
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    display: 'inline-block',
                  }}
                  onClick={() => setShowUpdateRSVPForm(true)}
                >
                  Modify Existing RSVP
                </Typography>
              ) : (
                <RSVPSearchForm
                  eventId={String(event.id)}
                  onSearchSuccess={(rsvp, user) => {
                    setEventRSVP(rsvp);
                    setRsvpStatus(rsvp.status as string);
                    setIsRSVPDialogOpen(true);
                    setShowUpdateRSVPForm(false);
                    setStoredEmail(rsvp.email);
                    setStoredUser(user);
                  }}
                  onCancel={() => {
                    setShowUpdateRSVPForm(false);
                  }}
                  buttonText='Search'
                  cancelText='Cancel'
                  label='Enter your email'
                />
              )}
            </Box>
          </>
        )}
      </Box>
      {/* Show full InvitePostRSVPSection for Going or Maybe responses, but only donation section for Declined */}
      {eventRSVP?.status && (
        <InvitePostRSVPSection event={event} currentRSVP={eventRSVP} showDonationSectionOnly={eventRSVP.status === 'Declined'} />
      )}
      {false && event.fundraisingGoal && (
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
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <hr></hr>
                  <InviteDonationSection
                    event={event}
                    currentRSVP={eventRSVP}
                    currentAmount={20}
                    goalAmount={Number(event.fundraisingGoal)}
                    donors={[]}
                    isDeclined={true}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {event.description && (
        <Box sx={{ mt: 3 }}>
          <Typography color='primary' variant='h6'>
            Event Details:
          </Typography>
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
        hasRSVP={showHostsOnly ? true : !!eventRSVP}
        users={showHostsOnly ? hosts : [...getProcessedUsersForStatus('Going'), ...getProcessedUsersForStatus('Maybe')]}
        goingCount={showHostsOnly ? 0 : rsvps?.filter(r => r.status === 'Going')?.length || 0}
        maybeCount={showHostsOnly ? 0 : rsvps?.filter(r => r.status === 'Maybe')?.length || 0}
        showHostsOnly={showHostsOnly}
        eventId={event.id}
        onRSVP={() => {
          setIsGuestListDialogOpen(false);
          setIsRSVPDialogOpen(true);
        }}
        onSignIn={() => {
          setIsGuestListDialogOpen(false);
          setIsSignInMode(true);
          setIsRSVPDialogOpen(true);
        }}
        currentUser={eventRSVP?.user || storedUser}
      />
      <LocationMapDialog open={isLocationMapDialogOpen} onClose={() => setIsLocationMapDialogOpen(false)} location={event.location} />
    </>
  );
};

export default EventInvite;
