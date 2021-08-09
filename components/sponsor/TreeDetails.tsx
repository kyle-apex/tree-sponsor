import { User } from '.prisma/client';
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';

export type TreeDetail = {
  title: string;
  description: string;
  user: Partial<User>;
  pictureUrl: string;
};

const useStyles = makeStyles(theme => ({
  thumbnail: {
    width: '30px',
    height: '30px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  fullImage: {
    width: '100%',
  },
}));

const TreeDetails = () => {
  const classes = useStyles();
  // read or input tree details
  const detail: TreeDetail = {
    title: 'My Tree',
    description: 'Something about my tree',
    user: { id: 1, name: 'Kyle Hoskins' },
    pictureUrl: 'https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Plants-and-Fungi/plant_southern-live-oak_600x300.ashx',
  };
  //
  return (
    <Grid>
      <Grid container direction='row' spacing={2} alignItems='center'>
        <Grid item>
          <div className={classes.thumbnail} style={{ backgroundImage: `url(${detail.pictureUrl})` }}></div>
        </Grid>
        <Grid item>
          <h2>{detail.title}</h2>
        </Grid>
      </Grid>
      <p>{detail.description}</p>
      <img src={detail.pictureUrl} className={classes.fullImage}></img>
    </Grid>
  );
};

export default TreeDetails;
