import { Card, CardContent, CardHeader, Skeleton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const useStyles = makeStyles(() => ({
  addIcon: {
    fontSize: '80px',
  },
  cardContent: {
    display: 'flex',
    flex: '1 1 auto',
    height: '250px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
  },
}));

const AddTreeButton = ({ isStartSubscription, onAddClick }: { isStartSubscription?: boolean; onAddClick?: () => void }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        if (isStartSubscription) router.push('/signup');
        else onAddClick();
      }}
      sx={{ cursor: 'pointer' }}
    >
      <CardHeader
        avatar={<Skeleton animation={false} variant='circular' width={40} height={40} />}
        title={<Skeleton animation={false} variant='text' />}
      ></CardHeader>
      <CardContent className={classes.cardContent}>
        {isStartSubscription ? (
          <>
            <AddIcon classes={{ root: classes.addIcon }} color='secondary'></AddIcon>
            <Typography sx={{ color: theme => theme.palette.secondary.main }}>Start a new subscription!</Typography>
          </>
        ) : (
          <>
            <AddPhotoAlternateIcon classes={{ root: classes.addIcon }} color='secondary'></AddPhotoAlternateIcon>
            <Typography sx={{ color: theme => theme.palette.secondary.main }}>Set up your Sponsored Tree!</Typography>
          </>
        )}
      </CardContent>
      <CardContent>
        <Skeleton animation={false} variant='text' />
      </CardContent>
    </Card>
  );
};
export default AddTreeButton;
//
<Skeleton variant='rectangular' animation={false} width={'100%'} height={118} />;
