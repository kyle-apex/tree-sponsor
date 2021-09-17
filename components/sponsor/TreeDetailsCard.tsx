import { User } from '.prisma/client';
import {
  Grid,
  makeStyles,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  CardMedia,
  Typography,
  CardActions,
} from '@material-ui/core';
import { Details } from '@material-ui/icons';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
  avatar: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  subtitle: {
    color: theme.palette.grey[600],
    //fontStyle: 'italic',
    //fontSize: theme.typography.subtitle1.fontSize,
    marginTop: '-20px',
  },
}));

const TreeDetailsCard = ({ detail }: { detail?: TreeDetail }) => {
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
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label='recipe' className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label='settings'>
              <MoreVertIcon />
            </IconButton>
          }
          title={detail.title}
          subheader={
            <span>
              {detail.startDate.toLocaleString('default', { month: 'long', day: 'numeric' })}
              {detail.startDate.getFullYear() != new Date().getFullYear() && <span>, {detail.startDate.getFullYear()}</span>}
            </span>
          }
        />
        <CardMedia className={classes.media} image={detail.pictureUrl} title='Paella dish' />
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {detail.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label='share'>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
};

export default TreeDetailsCard;
