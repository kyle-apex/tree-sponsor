import { Card, CardContent, CardActions, CardHeader, Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
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
