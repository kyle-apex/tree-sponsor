import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { PartialProfile } from 'interfaces';

const AttendeeContactForm = ({ profile, setProfile }: { profile: PartialProfile; setProfile: (profile: PartialProfile) => void }) => {
  return (
    <>
      <TextField
        value={profile.instagramHandle}
        onChange={e => {
          setProfile({ ...profile, instagramHandle: e.target.value });
        }}
        fullWidth
        label='Instagram Handle'
        size='small'
        sx={{ marginBottom: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position='start'>@</InputAdornment>,
        }}
        id='instagram-field'
      ></TextField>
      <TextField
        value={profile.twitterHandle}
        onChange={e => {
          setProfile({ ...profile, twitterHandle: e.target.value });
        }}
        InputProps={{
          startAdornment: <InputAdornment position='start'>@</InputAdornment>,
        }}
        fullWidth
        label='Twitter Handle'
        size='small'
        sx={{ marginBottom: 3 }}
        id='twitter-field'
      ></TextField>
      <TextField
        value={profile.linkedInLink}
        onChange={e => {
          setProfile({ ...profile, linkedInLink: e.target.value });
        }}
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position='start'>linkedin.com/in/</InputAdornment>,
        }}
        label='LinkedIn Link'
        size='small'
        sx={{ marginBottom: 3 }}
        id='linkedin-field'
      ></TextField>
      <TextField
        value={profile.organization}
        onChange={e => {
          setProfile({ ...profile, organization: e.target.value });
        }}
        fullWidth
        label='Company/Organization'
        size='small'
        sx={{ marginBottom: 3 }}
        id='organization-field'
      ></TextField>
    </>
  );
};
export default AttendeeContactForm;
