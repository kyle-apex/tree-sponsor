import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import SafeHTMLDisplay from 'components/SafeHTMLDisplay';
import { PartialUser } from 'interfaces';

const CoreTeamBio = ({ user }: { user: PartialUser }) => {
  return (
    <Box component='div' sx={{ width: '100%', textAlign: 'center', padding: '0 30px' }} className='inset-box-shadow'>
      <Image
        height='200px'
        width='200px'
        style={{ borderRadius: '100px', margin: '0 auto 20px', textAlign: 'center', boxShadow: 'inset 0 0 10px gray' }}
        alt={user.displayName || user.name}
        src={user.image}
        title={user.displayName || user.name}
      />
      <Typography variant='h5' color='secondary' sx={{ textAlign: 'center', marginBottom: 2, marginTop: 1 }}>
        {user.displayName || user.name}
      </Typography>
      <Typography variant='body2' sx={{ fontStyle: 'italic', textAlign: 'left' }}>
        {user.profile?.bio
          ?.replace(/(<([^>]+)>)/gi, '')
          .replace(/&nbsp;/g, ' ')
          .substring(0, 500)}
      </Typography>
    </Box>
  );
};
export default CoreTeamBio;
