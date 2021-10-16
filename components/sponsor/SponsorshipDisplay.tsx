import { User } from '.prisma/client';
import { Card, CardHeader, CardContent, IconButton, CardMedia, Typography, CardActions } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Clear } from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { PartialSponsorship } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { SponsorshipAvatar, SponsorshipSubTitle } from 'components/sponsor';
import { DEFAULT_DESCRIPTION } from 'consts';
import SponsorshipAddEditDialog from './SponsorshipAddEditDialog';

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
    // paddingTop: '56.25%', // 16:9
  },
  subtitle: {
    color: theme.palette.grey[600],
    marginTop: '-20px',
  },
}));

const SponsorshipDisplay = ({
  sponsorship,
  isEditMode,
  onDelete,
  handleClose,
  hasFullHeightImage,
}: {
  sponsorship?: PartialSponsorship;
  isEditMode?: boolean;
  onDelete?: (id: number) => void;
  handleClose?: () => void;
  hasFullHeightImage?: boolean;
}) => {
  const classes = useStyles();

  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeSponsorship, setActiveSponsorship] = useState<PartialSponsorship>();

  return (
    <>
      {sponsorship?.id && (
        <Card>
          <CardHeader
            avatar={<SponsorshipAvatar image={sponsorship.user?.image} name={sponsorship.user?.name} />}
            title={sponsorship.title || 'Sponsored by ' + sponsorship.user?.name}
            subheader={<SponsorshipSubTitle startDate={sponsorship.startDate} />}
            action={
              handleClose && (
                <IconButton onClick={handleClose}>
                  <Clear></Clear>
                </IconButton>
              )
            }
          />
          <CardMedia
            sx={{
              paddingTop: hasFullHeightImage
                ? sponsorship.primaryImageHeight
                  ? (sponsorship.primaryImageHeight / sponsorship.primaryImageWidth) * 100 + '%'
                  : '90%'
                : '56.25%',
            }}
            className={classes.media}
            image={sponsorship.pictureUrl}
            title={sponsorship.title}
          />
          <CardContent>
            <Typography variant='body2' color='textSecondary' component='p'>
              {sponsorship.description || DEFAULT_DESCRIPTION}
            </Typography>
          </CardContent>
          {isEditMode && (
            <CardActions disableSpacing>
              {false && (
                <IconButton aria-label='share' size='large'>
                  <ShareIcon />
                </IconButton>
              )}
              {isEditMode && (
                <>
                  <IconButton
                    aria-label='edit'
                    size='large'
                    onClick={() => {
                      setActiveSponsorship(sponsorship);
                      setIsEditDialogOpen(true);
                    }}
                  >
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
          )}
        </Card>
      )}
      <SponsorshipAddEditDialog sponsorship={activeSponsorship} isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
    </>
  );
};

export default SponsorshipDisplay;
