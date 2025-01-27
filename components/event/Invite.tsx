import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LeaderRow, MembershipStatus, PartialEvent, CheckinFields, PartialUser, PartialEventRSVP } from 'interfaces';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import formatDateString from 'utils/formatDateString';
import useLocalStorage from 'utils/hooks/use-local-storage';
import EventNameDisplay from './EventNameDisplay';
import Image from 'next/image';
import UserBubbles from './UserBubbles';
import SplitRow from 'components/layout/SplitRow';
import { UserAvatar } from 'components/sponsor';
import Button from '@mui/material/Button';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PlaceIcon from '@mui/icons-material/Place';
import { Place } from '@mui/icons-material';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import ExpandCollapseSection from 'components/layout/ExpandCollapseSection';
import { useGet } from 'utils/hooks/use-get';
import { useAddToQuery } from 'utils/hooks/use-add-to-query';
import axios from 'axios';
import InviteRSVPDialog from './InviteRSVPDialog';

const testUsers: PartialUser[] = [
  {
    id: 0,
    name: 'Eduardo Rosillo',
    image: 'https://www.treefolks.org/wp-content/uploads/2023/02/IMG_1436-Eduardo-Rosillo-e1676232827230.jpeg',
  },
  {
    id: 1,
    name: 'Kim Olden',
    image: 'https://www.treefolks.org/wp-content/uploads/2023/08/Untitled-300-x-300-px.jpg',
  },
  {
    id: 2,
    name: 'Kyle2 Hoskins2',
    image:
      'https://sponsortrees.s3.amazonaws.com/profile-images/0ca1b0cfe64db2e0d12bef1628b1c0bb8eefa4d69b467ba7b21a3cafc720bb93?d=1697199202473',
  },
  {
    id: 3,
    name: 'Ruth Dunnescu',
    image:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=33902244451765&height=50&width=50&ext=1707343710&hash=AfqS771NxDbmFp5hdHg7UGp1V1ZZuLFBK7gZezNQ6Ays0Q',
  },
  {
    id: 4,
    name: 'Joshua Johnson',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/2afa14e56ab6d4415043d6bd8520eb3a737d807b28841468598ad6f010e9a006',
  },
  {
    id: 5,
    name: 'Timothy J Cole',
    image:
      'https://sponsortrees.s3.amazonaws.com/profile-images/83111f16b46ec96aa91cc9ce100c24fc08da71001c010d291ca0237bc9404ffb?d=1725583498900',
  },
  {
    id: 6,
    name: 'Julia Ruth',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/e7f626d5e7e15c19a21e422987be6cbe387f5e2f02218730afa0dc02dfbbdb8e',
  },
  {
    id: 7,
    name: 'Valerie Benson',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/155fc8e1a614d37ae78359119a4e6520370ce53e60b8d7bd655835dab769dd04',
  },
  {
    id: 8,
    name: 'Celeste Flahaven',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/bcf1a608ba618a48f1f26bdad7010dc8be3de1717e19e5102273cea44ba399ed',
  },
  {
    id: 9,
    name: 'Jonathan Friedman',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/41268205568b9da6f2de39daeba7d1e8bc1870f446c0a4f0f589fa60d80ec90d',
  },
  {
    id: 10,
    name: 'Kristen Koppel',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/ecd808ce9d6896d639d0edbdfcbb69b16096e0ad3cda461e2bf5cf0184c3854b',
  },
  {
    id: 11,
    name: 'Davin Singh',
    image: 'https://sponsortrees.s3.amazonaws.com/profile-images/1a0305b8984cfb650ab7cc2b7197a89ad79673ed34ec7220bc3b7c8922a24076',
  },
];
const hosts = testUsers.slice(0, 6).reverse();

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
  const [storedEmail, setStoredEmail] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const [storedUser, setStoredUser] = useState<PartialUser>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventRSVP, setEventRSVP] = useState<PartialEventRSVP>();
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const {
    data: rsvps,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialEventRSVP[]>(`/api/events/${event.id}/rsvps`, `events/${event.id}/rsvps`, null);

  const getUserData = async (email: string) => {
    const results: any = await axios.get(`/api/events/${event.id}/rsvps?email=${email}`);
    const { rsvp, user }: { rsvp: PartialEventRSVP; user: PartialUser } = results?.data;

    setEventRSVP(rsvp);
    setStoredUser(user);
  };

  useEffect(() => {
    if (storedEmail) {
      getUserData(storedEmail);
    }
  }, [storedEmail]);

  return (
    <>
      <Box sx={{ textAlign: 'left', mt: -1 }} mb={2}>
        <img
          style={{
            width: 'calc(100% + 41px)',
            marginLeft: '-21px',
            marginTop: '-2px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
          src='https://secure.meetupstatic.com/photos/event/4/3/1/f/600_521177183.webp?w=750'
        ></img>
        {false && (
          <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px' }} mb={1}>
            <UserAvatar image={hosts[0].image} name={hosts[0].name} size={16}></UserAvatar>
            <Typography variant='body2' color='gray' sx={{ fontStyle: 'italic' }}>
              {hosts[0].name} invited you to:
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
        <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px' }}>
          <PlaceIcon sx={{ fontSize: '14x', color: 'gray' }}></PlaceIcon>
          <Typography variant='subtitle2' sx={{ fontSize: '1rem' }}>
            {event.location.name}
          </Typography>
        </Box>
      </Box>
      <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '5px' }}>
        <Typography whiteSpace='nowrap'>Hosted By:</Typography>
        <UserBubbles users={hosts} maxLength={3} size={28} />
        <Typography color='gray' variant='body2'>
          {hosts[0].name}
          {hosts?.length > 1 ? ` and ${hosts?.length - 1} others` : ''}
        </Typography>
      </Box>
      <Box
        sx={{ border: 'solid 2px', borderRadius: '5px', borderColor: theme => theme.palette.primary.main, padding: '10px' }}
        className='box-shadow'
        mt={2}
      >
        <Box>
          <SplitRow>
            <Typography>
              {testUsers?.length - 5} Going {testUsers?.length - 7} Maybe
            </Typography>
            <a style={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 600 }}>View Guest List</a>
          </SplitRow>
        </Box>
        <hr />
        <Box flexDirection='row' alignItems='center' style={{ display: 'flex', gap: '10px' }}>
          <UserBubbles ml={-1.4} users={testUsers} maxLength={6} size={24} />
          <Typography color='gray' variant='body2'>
            {testUsers[0].name}, {testUsers[1].name}
            {testUsers?.length > 2 ? `, and ${testUsers?.length - 2} others` : ''}
          </Typography>
        </Box>
        <Typography sx={{ mt: 2, mb: 2 }}>
          {invitedByUser?.name ? invitedByUser.name : 'TreeFolksYP'} invited you to {event.name} on {formatDateString(event?.startDate)}{' '}
          6:30-8pm:
        </Typography>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mb: 1.5 }}
          onClick={() => {
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
              setIsRSVPDialogOpen(true);
            }}
          >
            Maybe
          </Button>
          <Button fullWidth variant='outlined' color='secondary'>
            Decline
          </Button>
        </SplitRow>
      </Box>
      {event.checkInDetails && (
        <Box sx={{ mt: 3 }}>
          <Typography>Event Details:</Typography>
          <Typography variant='body2' color='gray'>
            <ExpandCollapseSection maxHeight={200}>
              <SafeHTMLDisplay html={event.checkInDetails}></SafeHTMLDisplay>
            </ExpandCollapseSection>
          </Typography>
        </Box>
      )}
      <InviteRSVPDialog
        event={event}
        initialEmail={storedEmail}
        initialName={storedUser?.name}
        isOpen={isRSVPDialogOpen}
        setIsOpen={setIsRSVPDialogOpen}
        invitedByUser={invitedByUser}
      />
    </>
  );
};
export default EventInvite;
