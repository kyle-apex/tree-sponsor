import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const TFYPAboutSection = () => {
  return (
    <Grid container spacing={5} direction='row' justifyContent='space-around'>
      <Grid md={3} sx={{ textAlign: 'center' }} item>
        <img className='detail-image' src='/index/service.jpg' alt='Service' />
        <Typography variant='h3' color='primary' className='detail-title'>
          Service
        </Typography>
        <div className='detail-content'>
          TreeFolks has planted more than 2.8 million trees across Central Texas. TreeFolks Young Professionals&apos; volunteerism and gifts
          support the next million.
        </div>
      </Grid>
      <Grid md={3} sx={{ textAlign: 'center' }} item>
        <img className='detail-image' src='/index/social.jpg' alt='Service' />
        <Typography variant='h3' color='primary' className='detail-title'>
          Social
        </Typography>
        <div className='detail-content'>
          {'Keep up with us on '}<a href="https://www.instagram.com/treefolks_yp/" target="_blank" rel="noreferrer">Instagram</a>{' or our '}<a href="https://www.meetup.com/TreeFolks-Young-Professionals/" target="_blank" rel="noreferrer">Meetup.com</a>{' group and make new friends at group volunteer events and socials like Tree Mappy Hours and Solstice parties.'}
        </div>
      </Grid>
      <Grid md={3} sx={{ textAlign: 'center' }} item>
        <img className='detail-image' src='/index/education.jpg' alt='Education' />
        <Typography variant='h3' color='primary' className='detail-title'>
          🔟 for the 🌳s
        </Typography>
        <div className='detail-content'>
          Take involvement to greater heights with our Ten [minutes] for the Trees pledge where members can optionally dedicate 10 minutes/week toward trees/TreeFolks and share what they did, thought of, or learned in our membership community.
        </div>
      </Grid>
      <Grid md={3} sx={{ textAlign: 'center' }} item>
        <img className='detail-image' src='/index/membership.jpg' alt='Membership' />
        <Typography variant='h3' color='primary' className='detail-title'>
          Membership
        </Typography>
        <div className='detail-content'>
          Grow your positive environmental impact, knowledge, and circle of friends by becoming a TreeFolks Young Professional Member.{' '}
          <Link href='/membership'>
            <a>
              <Typography color='primary' sx={{ fontWeight: 600 }}>
                View our membership options!
              </Typography>
            </a>
          </Link>
        </div>
      </Grid>
    </Grid>
  );
};
export default TFYPAboutSection;
