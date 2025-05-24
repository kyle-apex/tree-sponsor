import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields, PartialUser, PartialEventRSVP } from 'interfaces';
import { SetStateAction, useEffect, useRef, useState } from 'react';
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
      {event.organizers?.length > 0 && (
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
          <UserBubbles users={event.organizers} maxLength={3} size={28} />
          <Typography color='gray' variant='body2'>
            {event.organizers[0].name}
            {event.organizers.length > 1 ? ` and ${event.organizers.length - 1} others` : ''}
          </Typography>
        </Box>
      )}
      <Box
        sx={{ border: 'solid 2px', borderRadius: '5px', borderColor: theme => theme.palette.primary.main, padding: '10px' }}
        className='box-shadow rsvp-button-section'
        mt={2}
      >
        <Box>
          <SplitRow>
            <Typography>
              {rsvps?.filter(r => r.status === 'Going')?.length || 0} Going {rsvps?.filter(r => r.status === 'Maybe')?.length || 0} Maybe
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
      {/* Show "Want to help spread the word?" section only for Going or Maybe responses */}
      {(eventRSVP?.status === 'Going' || eventRSVP?.status === 'Maybe') && <InvitePostRSVPSection event={event} currentRSVP={eventRSVP} />}
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
        hasRSVP={showHostsOnly ? true : !!eventRSVP}
        users={
          showHostsOnly
            ? event.organizers || []
            : [
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
              ]
        }
        goingCount={showHostsOnly ? 0 : rsvps?.filter(r => r.status === 'Going')?.length || 0}
        maybeCount={showHostsOnly ? 0 : rsvps?.filter(r => r.status === 'Maybe')?.length || 0}
        showHostsOnly={showHostsOnly}
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
