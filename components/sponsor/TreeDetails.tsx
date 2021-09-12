import { User } from '.prisma/client';
import { Grid, makeStyles } from '@material-ui/core';
import { Details } from '@material-ui/icons';
import React from 'react';

export type TreeDetail = {
  title?: string;
  description?: string;
  user?: Partial<User>;
  pictureUrl?: string;
  startDate?: Date;
  expirationDate?: Date;
};

const useStyles = makeStyles(theme => ({
  thumbnail: {
    width: '45px',
    height: '45px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  fullImage: {
    width: '100%',
  },
  title: {
    marginTop: '10px',
  },
  subtitle: {
    color: theme.palette.grey[600],
    //fontStyle: 'italic',
    //fontSize: theme.typography.subtitle1.fontSize,
    marginTop: '-20px',
  },
}));

const TreeDetails = ({ detail }: { detail: TreeDetail }) => {
  const classes = useStyles();
  // read or input tree details
  detail = detail || {
    title: 'My Tree',
    description: 'Something about my tree',
    startDate: new Date(),
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
          <p className={classes.subtitle}>
            {detail.user?.name && <span>Sponsored by {detail.user.name} - )</span>}
            {detail.startDate && (
              <span>
                {detail.startDate.toLocaleString('default', { month: 'long', day: 'numeric' })}
                {detail.startDate.getFullYear() != new Date().getFullYear() && <span>, {detail.startDate.getFullYear()}</span>}
              </span>
            )}
          </p>
        </Grid>
      </Grid>

      <p>{detail.description}</p>
      <img src={detail.pictureUrl} className={classes.fullImage}></img>
    </Grid>
  );
};

export default TreeDetails;
