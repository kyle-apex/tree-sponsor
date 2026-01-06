import { useState, useEffect } from 'react';
import { PartialEvent, Session } from 'interfaces';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/client';

type EmailType = 'reminder' | 'rsvp' | 'inviter';

interface TestEmailFormProps {
  event: PartialEvent;
}

const TestEmailForm: React.FC<TestEmailFormProps> = ({ event }) => {
  const [session] = useSession();
  const [email, setEmail] = useState('');

  // Pre-fill email from session when component mounts or session changes
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);
  const [emailType, setEmailType] = useState<EmailType>('reminder');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailTypeChange = (e: SelectChangeEvent) => {
    setEmailType(e.target.value as EmailType);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSnackbar({
        open: true,
        message: 'Please enter an email address',
        severity: 'error',
      });
      return;
    }

    if (!event.id) {
      setSnackbar({
        open: true,
        message: 'Event must be saved before sending test emails',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/events/send-test-email', {
        eventId: event.id,
        email,
        emailType,
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Test ${emailType} email sent successfully to ${email}`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to send test email',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send test email',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 4, mb: 3 }}>
      <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon color='primary' />
        Send Test Email
      </Typography>

      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Send a test email to verify how event emails will appear to recipients.
      </Typography>

      <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='Email Address'
          type='email'
          value={email}
          onChange={handleEmailChange}
          fullWidth
          required
          size='small'
          placeholder='Enter recipient email address'
        />

        <FormControl fullWidth size='small'>
          <InputLabel id='email-type-label'>Email Type</InputLabel>
          <Select labelId='email-type-label' value={emailType} onChange={handleEmailTypeChange} label='Email Type'>
            <MenuItem value='reminder'>Reminder Email</MenuItem>
            <MenuItem value='rsvp'>RSVP Confirmation Email</MenuItem>
            <MenuItem value='inviter'>Invite Notification Email</MenuItem>
          </Select>
        </FormControl>

        <LoadingButton variant='contained' isLoading={isLoading} onClick={handleSubmit} sx={{ mt: 1, alignSelf: 'flex-start' }}>
          Send Test Email
        </LoadingButton>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// Add prop validation to fix ESLint errors
TestEmailForm.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    // Add other event properties as needed
  }).isRequired,
};

export default TestEmailForm;
