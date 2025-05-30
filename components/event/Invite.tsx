import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
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
  const [updateRSVPEmail, setUpdateRSVPEmail] = useState('');
  const [isSearchingRSVP, setIsSearchingRSVP] = useState(false);
  const [rsvpSearchError, setRsvpSearchError] = useState('');

  // Use localStorage to store RSVP data for this specific event
  const {
    data: rsvps,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialEventRSVP[]>(`/api/events/${event.id}/rsvps`, `events/${event.id}/rsvps`, null, { refetchOnWindowFocus: true });

  const rsvpsWithoutDeclined = rsvps?.filter(r => r.status === 'Going' || r.status === 'Maybe') || [];

  const getUserData = async (email: string) => {
    const results: any = await axios.get(`/api/events/${event.id}/rsvps?email=${email}`);
    const { rsvp, user }: { rsvp: PartialEventRSVP; user: PartialUser } = results?.data;

    if (rsvp) {
      setEventRSVP(rsvp);
    }
    setStoredUser(user);
    return { rsvp, user };
  };

  const searchExistingRSVP = async () => {
    if (!updateRSVPEmail) return;

    setIsSearchingRSVP(true);
    setRsvpSearchError('');
    setStoredEmail(updateRSVPEmail);

    try {
      const { rsvp, user } = await getUserData(updateRSVPEmail);

      if (rsvp) {
        // If RSVP found, set it and open the dialog
        setEventRSVP(rsvp);
        setRsvpStatus(rsvp.status as string);

        setIsRSVPDialogOpen(true);
        setShowUpdateRSVPForm(false);
        setUpdateRSVPEmail('');
      } else {
        // No RSVP found for this email
        setRsvpSearchError('No RSVP found for this email address.');
      }
    } catch (error) {
      console.error('Error searching for RSVP:', error);
      setRsvpSearchError('Error searching for RSVP. Please try again.');
    } finally {
      setIsSearchingRSVP(false);
    }
  };

  // Helper function to process users for a given status
  const getProcessedUsersForStatus = (status: string) => {
    return (
      rsvps
        ?.filter(r => r.status === status)
        .sort((a: PartialEventRSVP, b: PartialEventRSVP) => {
          if (invitedByUser?.id) {
            const aInvitedByUser = a.invitedByUserId === invitedByUser.id || a.userId == invitedByUser.id;
            const bInvitedByUser = b.invitedByUserId === invitedByUser.id || b.userId == invitedByUser.id;

            if (aInvitedByUser && !bInvitedByUser) return -1;
            if (!aInvitedByUser && bInvitedByUser) return 1;
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
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size='small'
                      placeholder='Enter your email'
                      fullWidth
                      value={updateRSVPEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateRSVPEmail(e.target.value)}
                      disabled={isSearchingRSVP}
                      error={!!rsvpSearchError}
                    />
                    <LoadingButton
                      variant='outlined'
                      size='small'
                      onClick={searchExistingRSVP}
                      isLoading={isSearchingRSVP}
                      disabled={!updateRSVPEmail || isSearchingRSVP}
                    >
                      Search
                    </LoadingButton>
                  </Box>

                  {rsvpSearchError && (
                    <Typography variant='body2' color='error' sx={{ mt: 1, fontSize: '0.8rem' }}>
                      {rsvpSearchError}
                    </Typography>
                  )}

                  <Typography
                    variant='body2'
                    color='primary'
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.8rem',
                      mt: 1,
                    }}
                    onClick={() => {
                      setShowUpdateRSVPForm(false);
                      setUpdateRSVPEmail('');
                      setRsvpSearchError('');
                    }}
                  >
                    Cancel
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
      {/* Show full InvitePostRSVPSection for Going or Maybe responses, but only donation section for Declined */}
      {eventRSVP?.status && (
        <InvitePostRSVPSection event={event} currentRSVP={eventRSVP} showDonationSectionOnly={eventRSVP.status === 'Declined'} />
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
        users={showHostsOnly ? event.organizers || [] : [...getProcessedUsersForStatus('Going'), ...getProcessedUsersForStatus('Maybe')]}
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
