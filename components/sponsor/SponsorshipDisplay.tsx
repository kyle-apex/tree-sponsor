import { User } from '.prisma/client';
import { Grid, Collapse, Card, CardHeader, CardContent, Avatar, IconButton, CardMedia, Typography, CardActions } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Details } from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';
import { PartialSponsorship } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

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

const SponsorshipDisplay = ({
  sponsorship,
  isEditMode,
  onDelete,
}: {
  sponsorship?: PartialSponsorship;
  isEditMode?: boolean;
  onDelete?: (id: number) => void;
}) => {
  const classes = useStyles();

  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);

  // read or input tree details
  sponsorship = sponsorship || {
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
          title={sponsorship.title}
          subheader={
            sponsorship.startDate && (
              <span>
                {sponsorship.startDate.toLocaleString('default', { month: 'long', day: 'numeric' })}
                {sponsorship.startDate.getFullYear() != new Date().getFullYear() && <span>, {sponsorship.startDate.getFullYear()}</span>}
              </span>
            )
          }
        />
        <CardMedia className={classes.media} image={sponsorship.pictureUrl} title={sponsorship.title} />
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {sponsorship.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label='share' size='large'>
            <ShareIcon />
          </IconButton>
          {isEditMode && (
            <>
              <IconButton aria-label='edit' size='large'>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setIsDeleteConfirmation(true);
                }}
                aria-label='delete'
                size='large'
              >
                <DeleteIcon />
              </IconButton>
              <DeleteConfirmationDialog
                open={isDeleteConfirmation}
                setOpen={setIsDeleteConfirmation}
                onConfirm={() => {
                  onDelete(sponsorship.id);
                }}
              ></DeleteConfirmationDialog>
            </>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default SponsorshipDisplay;
