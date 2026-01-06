import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { UserAvatar } from 'components/sponsor';
import { PartialEventRSVP, PartialUser } from 'interfaces';
import axios from 'axios';
import formatDateString from 'utils/formatDateString';

interface InvitedPeopleSectionProps {
  eventId: number;
  currentUserId: number;
}

const InvitedPeopleSection = ({ eventId, currentUserId }: InvitedPeopleSectionProps) => {
  const [invitedPeople, setInvitedPeople] = useState<PartialEventRSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitedPeople = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${eventId}/rsvps?invitedByUserId=${currentUserId}`);
        // Sort by creation date (oldest first)
        const sortedRSVPs = response.data.sort((a: PartialEventRSVP, b: PartialEventRSVP) => {
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        });
        setInvitedPeople(sortedRSVPs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invited people:', error);
        setLoading(false);
      }
    };

    if (eventId && currentUserId) {
      fetchInvitedPeople();
    }
  }, [eventId, currentUserId]);

  // If no invited people or still loading, don't render anything
  if ((invitedPeople.length === 0 && !loading) || !currentUserId) {
    return null;
  }

  const getRSVPStatusIcon = (status: string) => {
    switch (status) {
      case 'Going':
        return '🎉';
      case 'Maybe':
        return '🤷';
      case 'Declined':
        return '😔';
      case 'Invited':
        return '📨';
      default:
        return '❓';
    }
  };

  return (
    <Box mt={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '5px' }}>
      <Typography variant='h6' color='primary' gutterBottom>
        People You&apos;ve Invited
      </Typography>

      {loading ? (
        <Typography variant='body2'>Loading invited people...</Typography>
      ) : invitedPeople.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {invitedPeople.map((rsvp, index) => (
            <Box key={rsvp.id}>
              {index > 0 && <Divider component='li' />}
              <ListItem alignItems='flex-start' sx={{ px: 0.5 }}>
                <ListItemAvatar>
                  <UserAvatar image={rsvp.user?.image} name={rsvp.user?.name || rsvp.email || 'Guest'} size={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display='flex' alignItems='center' sx={{ flexWrap: 'wrap' }}>
                      <Typography component='span' variant='body1' color='text.primary' sx={{ fontWeight: 500 }}>
                        {rsvp.user?.name || rsvp.email || 'Guest'}
                      </Typography>
                      <Typography component='span' variant='body2' color='text.secondary' sx={{ ml: 1 }}>
                        {getRSVPStatusIcon(rsvp.status)} {rsvp.status}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography component='span' variant='body2' color='text.secondary'>
                      RSVP updated {formatDateString(rsvp.createdDate)}
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      ) : (
        <Typography variant='body2'>No one has responded to your invitations yet.</Typography>
      )}
    </Box>
  );
};

export default InvitedPeopleSection;
