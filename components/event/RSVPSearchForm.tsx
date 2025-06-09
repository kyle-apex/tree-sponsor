import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import { PartialEventRSVP, PartialUser } from 'interfaces';

interface RSVPSearchFormProps {
  eventId: string;
  onSearchSuccess: (rsvp: PartialEventRSVP, user: PartialUser) => void;
  onCancel?: () => void;
  buttonText?: string;
  cancelText?: string;
  initialEmail?: string;
  showCancelButton?: boolean;
  label?: string;
}

const RSVPSearchForm: React.FC<RSVPSearchFormProps> = ({
  eventId,
  onSearchSuccess,
  onCancel,
  buttonText = 'Search',
  cancelText = 'Cancel',
  initialEmail = '',
  showCancelButton = true,
  label = 'Enter your email',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const searchExistingRSVP = async () => {
    if (!email) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const results: any = await axios.get(`/api/events/${eventId}/rsvps?email=${email}`);
      const { rsvp, user }: { rsvp: PartialEventRSVP; user: PartialUser } = results?.data;

      if (rsvp) {
        // If RSVP found, call the success callback
        onSearchSuccess(rsvp, user);
        setEmail('');
      } else {
        // No RSVP found for this email
        setSearchError('No RSVP found for this email address.');
      }
    } catch (error) {
      console.error('Error searching for RSVP:', error);
      setSearchError('Error searching for RSVP. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          size='small'
          placeholder={label}
          fullWidth
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={isSearching}
          error={!!searchError}
        />
        <LoadingButton
          variant='outlined'
          size='small'
          onClick={searchExistingRSVP}
          isLoading={isSearching}
          disabled={!email || isSearching}
        >
          {buttonText}
        </LoadingButton>
      </Box>

      {searchError && (
        <Typography variant='body2' color='error' sx={{ mt: 1, fontSize: '0.8rem' }}>
          {searchError}
        </Typography>
      )}

      {showCancelButton && onCancel && (
        <Typography
          variant='body2'
          color='primary'
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.8rem',
            mt: 1,
          }}
          onClick={onCancel}
        >
          {cancelText}
        </Typography>
      )}
    </Box>
  );
};

export default RSVPSearchForm;
