import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import Link from 'next/link';
import Button from '@mui/material/Button';
import SplitRow from 'components/layout/SplitRow';
import useLocalStorage from 'utils/hooks/use-local-storage';
import Box from '@mui/material/Box';
import { useSession } from 'next-auth/client';
import { PartialEvent, PartialUser, PartialTree, Coordinate, PartialSpecies, PartialEventCheckIn, PartialSubscription } from 'interfaces';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';
import { useGet } from 'utils/hooks/use-get';
import Skeleton from '@mui/material/Skeleton';
import axios from 'axios';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoupeIcon from '@mui/icons-material/Loupe';
import dynamic from 'next/dynamic';
import useHashToggle from 'utils/hooks/use-hash-toggle';
import TreeIdQuiz from 'components/event/TreeIdQuiz';
import BecomeAMemberDialog from 'components/event/BecomeAMemberDialog';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import SkeletonContainer from 'components/layout/SkeletonContainer';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import CircularProgress from '@mui/material/CircularProgress';

const IdentifyTreeFlowDialog = dynamic(() => import('components/tree/IdentifyTreeFlowDialog'), {
  ssr: false,
});

const MapPage = ({ event }: { event?: PartialEvent }) => {
  console.log('e', event);
  const [session] = useSession();

  const [email, setEmail] = useLocalStorage('checkinEmail', '');
  const [isTreeDialogOpen, setIsTreeDialogOpen] = useState(false);

  const [isAddTreeDialogOpen, setIsAddTreeDialogOpen] = useState(false);
  const [isQuizRefreshing, setIsQuizRefreshing] = useState(false);
  const [isMembershipDialogOpen, setIsMembershipDialogOpen] = useState(false);
  const [mapLatitude, setMapLatitude] = useLocalStorage('mapLatitude', '');
  const [mapLongitude, setMapLongitude] = useLocalStorage('mapLongitude', '');

  const [selectedTree, setSelectedTree] = useState<PartialTree>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);

  const requestLocation = () => {
    console.log('requesting location access');
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setIsLoadingLocation(false);
        setIsLocationDenied(false);
        if (position?.coords?.latitude) {
          setMapLatitude(position.coords.latitude + '');
          setMapLongitude(position.coords.longitude + '');
        }
      },
      error => {
        setIsLoadingLocation(false);

        console.log('error', error);
        if (error.code == 1) setIsLocationDenied(true);
      },
    );
  };

  useEffect(() => {
    navigator.permissions
      .query({
        name: 'geolocation',
      })
      .then(function (result) {
        console.log('result', result);
        if (result.state == 'denied') setIsLocationDenied(true);
      });
  }, []);

  const { data: prioritySpecies, isFetched } = useGet<PartialSpecies>(
    '/api/species/priority',
    'prioritySpecies',
    {},
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  const lastYear = new Date();
  lastYear.setDate(lastYear.getDate() - 366);

  // const hasActiveMembership = status?.subscription?.lastPaymentDate > lastYear;

  //const userName = status?.subscription?.userName?.split(' ')[0] || '';

  return (
    <Layout title='Tree Map' header='TreeFolksYP'>
      <LogoMessage justifyContent='start'>
        <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={3}>
          Trees
        </Typography>
        <Typography variant='body2' mt={-2} mb={2} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
          Click tree map markers below to learn about trees around you and test your knowledge
        </Typography>
        <Box sx={{ textAlign: 'right', mt: -1.5, mb: 0.2, fontSize: '80%' }}>
          <SplitRow>
            <>
              {mapLatitude && (
                <a
                  onClick={() => {
                    setIsQuizRefreshing(true);
                  }}
                  style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center' }}
                >
                  <AutorenewIcon sx={{ fontSize: 'inherit' }} /> Refresh Trees
                </a>
              )}
            </>
            <a
              onClick={() => {
                if (!session?.user?.email) {
                  setIsMembershipDialogOpen(true);
                } else setIsAddTreeDialogOpen(true);
              }}
              style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', gap: '3px', alignItems: 'center' }}
            >
              <LoupeIcon sx={{ fontSize: 'inherit' }}></LoupeIcon> Identify a tree
            </a>
          </SplitRow>
          <BecomeAMemberDialog open={isMembershipDialogOpen} setOpen={setIsMembershipDialogOpen}></BecomeAMemberDialog>
        </Box>
        {!mapLatitude && (
          <SkeletonContainer sx={{ width: '100%', borderRadius: '12px', cursor: 'pointer' }} height={300} onClick={requestLocation}>
            <Box sx={{ padding: 2, color: 'var(--secondary-text-color)' }}>
              {!isLoadingLocation && <LocationOffIcon sx={{ fontSize: '50px' }}></LocationOffIcon>}
              {isLoadingLocation && <CircularProgress size={50}></CircularProgress>}
              {isLocationDenied && (
                <>
                  <Typography sx={{ mb: 2, mt: 2 }} variant='body2'>
                    You have disabled location services for this website.
                  </Typography>
                  <Typography variant='body2'>Enable your location settings or search for a location above.</Typography>
                </>
              )}
              {!isLocationDenied && (
                <Typography sx={{ mt: 2 }}>{!isLoadingLocation ? 'Tap here to find your location' : 'Requesting location...'}</Typography>
              )}
            </Box>
          </SkeletonContainer>
        )}
        {mapLatitude && (
          <TreeIdQuiz
            isRefreshing={isQuizRefreshing}
            setIsRefreshing={setIsQuizRefreshing}
            mapHeight='300px'
            showLocation={true}
            defaultLatitude={Number(mapLatitude)}
            defaultLongitude={Number(mapLongitude)}
          ></TreeIdQuiz>
        )}
        <Box sx={{ textAlign: 'right', mt: 0.2, mb: 1, fontSize: '80%' }}>
          <Link href='/leaders'>
            <a
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              <LeaderboardIcon sx={{ fontSize: 'inherit' }}></LeaderboardIcon> Tree ID leaderboard
            </a>
          </Link>
        </Box>
        <IdentifyTreeFlowDialog
          open={isAddTreeDialogOpen}
          setOpen={setIsAddTreeDialogOpen}
          onComplete={() => {
            console.log('completed');
            setIsQuizRefreshing(true);
          }}
        ></IdentifyTreeFlowDialog>

        <Typography variant='body2' component='p' mt={2} mb={2}>
          TreeFolks Young Professionals is the most fun way to support Central Texas&apos; urban forest.
        </Typography>
        <Typography variant='body2' component='p' mb={3}>
          Join today by starting an annual donation to TreeFolks starting at $20/yr:
        </Typography>
        <Link href='/membership'>
          <Button color='primary' variant='contained' sx={{ mb: 2 }}>
            Become a Member
          </Button>
        </Link>

        <TreeDisplayDialog tree={selectedTree} open={isTreeDialogOpen} setOpen={setIsTreeDialogOpen}></TreeDisplayDialog>
      </LogoMessage>
    </Layout>
  );
};
export default MapPage;
