import { Card, CardContent, CardHeader, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FullscreenExitTwoTone } from '@material-ui/icons';

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
