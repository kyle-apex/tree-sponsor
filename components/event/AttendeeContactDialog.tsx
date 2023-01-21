import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import SessionAvatar from 'components/SessionAvatar';
import { PartialUser } from 'interfaces';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';

const AttendeeContactDialog = ({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: PartialUser;
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const profile = user.profile;

  return (
    <Dialog
      open={isOpen}
      sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: profile?.bio ? '325px' : '275px', margin: '0px' } }}
      onClose={handleClose}
    >
      <DialogContent className=''>
        <Box style={{ position: 'relative', margin: '0px auto 10px auto', width: '100px', height: '100px' }}>
          <SessionAvatar session={{ user: user }} size={100}></SessionAvatar>
        </Box>
        <Typography variant='h5' color='secondary' mb={3} sx={{ textAlign: 'center' }}>
          {user.displayName || user.name}
        </Typography>
        {profile?.organization && (
          <Typography variant='subtitle2' color='gray' mb={3} mt={-3} sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            {profile.organization}
          </Typography>
        )}
        {profile?.bio && (
          <Typography variant='body2' mt={-1} mb={3}>
            <SafeHTMLDisplay html={profile.bio}></SafeHTMLDisplay>
          </Typography>
        )}
        {profile?.instagramHandle && (
          <a href={'https://instagram.com/' + profile?.instagramHandle} target='_blank' style={{ textDecoration: 'none' }} rel='noreferrer'>
            <Button fullWidth variant='outlined' sx={{ mb: 2 }}>
              <InstagramIcon sx={{ mr: 1 }}></InstagramIcon> Instagram
            </Button>
          </a>
        )}
        {profile?.linkedInLink && (
          <a
            href={'https://www.linkedin.com/in/' + profile?.linkedInLink}
            target='_blank'
            style={{ textDecoration: 'none' }}
            rel='noreferrer'
          >
            <Button fullWidth variant='outlined' sx={{ mb: 2 }}>
              <LinkedInIcon sx={{ mr: 1 }}></LinkedInIcon> LinkedIn
            </Button>
          </a>
        )}
        {profile?.twitterHandle && (
          <a href={'https://twitter.com/' + profile?.twitterHandle} target='_blank' style={{ textDecoration: 'none' }} rel='noreferrer'>
            <Button fullWidth variant='outlined'>
              <TwitterIcon sx={{ mr: 1 }}></TwitterIcon> Twitter
            </Button>
          </a>
        )}
        <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default AttendeeContactDialog;
