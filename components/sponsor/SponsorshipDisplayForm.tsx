import { Card, CardHeader, CardContent, Avatar, IconButton, CardMedia, Typography, CardActions, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import SponsorshipAvatar from 'components/sponsor/SponsorshipAvatar';

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
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  media: {
    minHeight: '200px',
  },
  subtitle: {
    color: theme.palette.grey[600],
    //fontStyle: 'italic',
    //fontSize: theme.typography.subtitle1.fontSize,
    marginTop: '-20px',
  },
}));

const SponsorshipDisplayForm = ({
  title,
  setTitle,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
}: //onChange,
{
  title: string;
  setTitle: (param: string) => void;
  description: string;
  setDescription: (param: string) => void;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const classes = useStyles();
  const [session] = useSession();

  //const [isEditingTitle, setIsEditingTitle] = useState(false);
  //const [isEditingDescription, setIsEditingDescription] = useState(false);

  const startDate = new Date();

  const getName = (): string => {
    return session?.user?.name ? session.user.name : 'Anonymous';
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={<SponsorshipAvatar image={session?.user?.image} name={session?.user?.name} />}
          title={
            <TextField
              size='small'
              placeholder={'Sponsored by ' + getName()}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='full-width'
            ></TextField>
          }
          subheader={<span>{startDate.toLocaleString('default', { month: 'long', day: 'numeric' })}</span>}
        />

        <CardMedia
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f1f1', cursor: 'pointer' }}
          component='div'
          className={classes.media}
          title={title}
        >
          <ImageUploadAndPreview imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </CardMedia>

        <CardContent>
          <TextField
            multiline={true}
            rows={3}
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
            placeholder='"I love this tree because..."     "In memory of..."     "I sponsored this tree because..."'
            className='full-width'
          ></TextField>
        </CardContent>
      </Card>
    </>
  );
};

export default SponsorshipDisplayForm;
