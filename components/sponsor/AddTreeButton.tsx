import { Card, CardContent, CardHeader } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { FullscreenExitTwoTone } from '@mui/icons-material';

const useStyles = makeStyles(() => ({
  addIcon: {
    fontSize: '80px',
  },
  cardContent: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const AddTreeButton = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Card
      onClick={() => {
        router.push('/sponsor');
      }}
    >
      <CardHeader title='Sponsor a Tree'></CardHeader>
      <CardContent className={classes.cardContent}>
        <AddCircleIcon classes={{ root: classes.addIcon }} color='primary'></AddCircleIcon>
      </CardContent>
    </Card>
  );
};
export default AddTreeButton;
