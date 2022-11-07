import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import { SponsorshipMap } from 'components/sponsor';
import TFYPAboutSection from 'components/index/TFYPAboutSection';
import parsedGet from 'utils/api/parsed-get';
import { TitleSection } from 'interfaces';

import { PartialSponsorship } from 'interfaces';
import { PollutionIcon, FloodingIcon, CurveTop, CurveBottom } from 'components/index/icons';

import ShadeImage from 'components/index/icons/ShadeImage';
import AtmosphereImage from 'components/index/icons/AtmosphereImage';
import ActivitiesImage from 'components/index/icons/ActivitiesImage';
import AnimalsImage from 'components/index/icons/AnimalsImage';
import SponsorshipGroup from 'components/sponsor/SponsorshipGroup';

const useStyles = makeStyles(theme => ({
  headlineContainer: {
    height: 'calc(100vh - 275px)',
    minHeight: '600px',
  },
  treeDetailsContainer: {},
  headlineSubTitle: {
    marginBottom: theme.spacing(4),
  },
}));

const treeBenefits: TitleSection[] = [
  { title: 'Pollution', description: 'Trees give us the air we breathe and remove toxins from the air' },
  { title: 'Flood Prevention', description: 'Roots help prevent soil erosion and soak up water to reduce flooding' },
  { title: 'Homes', description: 'Friends of all shapes and sizes call trees home and rely on them for food and shelter' },
  { title: 'Shade', description: 'Trees reduce electric bills and keep us cool' },
  { title: 'Atmosphere', description: 'Think of your favorite picnic, restaurant, bar, and/or park enhanced by trees' },
  { title: 'Activities', description: 'Do not forget to be grateful for climbing, swinging, decorating, and much more!' },
];
// Join us at our tree plantings, giveaways, tree maintenance, and cleanup events'
const getIcon = (title: string) => {
  switch (title) {
    case 'Pollution':
      return <PollutionIcon />;
    case 'Flood Prevention':
      return <FloodingIcon />;
    case 'Homes':
      return <AnimalsImage />;
    case 'Shade':
      return <ShadeImage />;
    case 'Atmosphere':
      return <AtmosphereImage />;
    case 'Activities':
      return <ActivitiesImage />;
  }
};

export const getStaticProps = async () => {
  return {
    props: {
      treeBenefits: treeBenefits,
    },
  };
};

const IndexPage = ({ treeBenefits }: { treeBenefits: TitleSection[] }) => {
  const [sponsorships, setSponsorships] = useState<PartialSponsorship[]>([]);
  const [isLoadingSponsorships, setIsLoadingSponsorships] = useState(false);

  const getSponsorships = async () => {
    setIsLoadingSponsorships(true);
    const results = await parsedGet<PartialSponsorship[]>('sponsorships/home');
    setSponsorships(results);
    setIsLoadingSponsorships(false);
  };

  useEffect(() => {
    getSponsorships();
  }, []);

  const classes = useStyles();

  return (
    <Layout isFullWidth={true}>
      <Container maxWidth='lg'>
        <Box sx={{ marginTop: '0px !important' }} p={5} className='index detail-section'>
          <Typography variant='h2'>What is TreeFolks Young Professionals?</Typography>
          <Typography variant='subtitle1' className={classes.headlineSubTitle}>
            TreeFolks Young Professionals (ages 21 – 40ish) volunteer, educate, fundraise, and build community in support of the mission of
            TreeFolks: planting, caring for, and giving people free trees to plant!
          </Typography>
        </Box>
        <Box mt={-15} mb={8} className='index'>
          <TFYPAboutSection></TFYPAboutSection>
        </Box>
      </Container>
      <Container maxWidth='lg'>
        <div
          style={{
            width: '100px',
            marginBottom: '25px',
            height: '3px',
            backgroundColor: '#486e62',
          }}
        ></div>
        <Typography variant='h2' color='secondary' mb={6}>
          Why Support the Urban Forest with an Annual Membership?
        </Typography>
        <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={2} mb={5}>
          {treeBenefits.map((benefit, idx) => (
            <Grid key={idx} item xs={12} sm={4} mb={4}>
              <Grid container gap='15px' wrap='nowrap' direction={{ xs: 'row', sm: 'row', md: 'row' }}>
                <Grid item className='icon-container' alignSelf={{ xs: 'start', sm: 'center' }}>
                  {getIcon(benefit.title)}
                </Grid>
                <Grid item>
                  <Typography variant='h6' color='primary'>
                    {benefit.title}
                  </Typography>
                  <Typography variant='caption'>{benefit.description}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
      <div style={{ height: '150px', width: '100%', marginTop: '-40px', overflow: 'hidden' }}>
        <CurveTop />
      </div>
      <div className='wide-container index'>
        <Container maxWidth='lg'>
          <Typography variant='h2' color='white' mb={4} mt={4} sx={{ textAlign: 'center' }}>
            How can I Thank-a-Tree?
          </Typography>
          <Grid container direction={{ xs: 'column', sm: 'row' }}>
            <Grid item sm={4}>
              <Box>
                <Box className='step-number'>1</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Snap a picture of your most appreciated tree(s)
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Box>
                <Box className='step-number'>2</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Support your tree(s) and future tree plantings with an annual TreeFolks donation of $20/tree
              </Typography>
            </Grid>
            <Grid item sm={4} className='center'>
              <Box>
                <Box className='step-number'>3</Box>
              </Box>
              <Typography variant='subtitle1' className='step-text'>
                Thank-a-Tree by adding a Token of Appre-tree-ation to the map
              </Typography>
              <Link href='/signup'>
                <Button variant='outlined' color='inherit'>
                  Get Started
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div style={{ height: '150px', width: '100%', overflow: 'hidden', transform: 'scaleY(-1) scaleX(-1)' }}>
        <CurveBottom />
      </div>
    </Layout>
  );
};

export default IndexPage;
