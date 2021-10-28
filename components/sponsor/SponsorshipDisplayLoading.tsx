import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const SponsorshipDisplayLoading = () => {
  return (
    <Card>
      <CardHeader avatar={<Skeleton variant='circular' width={40} height={40} />} title={<Skeleton variant='text' />}></CardHeader>
      <CardContent>
        <Skeleton variant='rectangular' width={'100%'} height={200} />
      </CardContent>
      <CardContent>
        <Skeleton variant='text' />
      </CardContent>
    </Card>
  );
};
export default SponsorshipDisplayLoading;
