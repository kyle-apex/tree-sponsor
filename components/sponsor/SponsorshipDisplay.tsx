import { User } from '.prisma/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/Clear';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { SetStateAction, useState } from 'react';
import { PartialSponsorship } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { UserAvatar, SponsorshipSubTitle } from 'components/sponsor';
import { DEFAULT_DESCRIPTION } from 'consts';
import { DEFAULT_TITLE_PREFIX } from 'consts';
import SponsorshipAddEditDialog from './SponsorshipAddEditDialog';
import Link from 'next/link';

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
  const [imageCacheKey, setImageCacheKey] = useState('');

  const handleDialogClose = (isOpen: SetStateAction<boolean>) => {
    setIsEditDialogOpen(isOpen);
    if (!isOpen) setImageCacheKey('?cacheKey=' + new Date().getTime());
  };

  return (
    <>
      {sponsorship?.id && (
        <Card sx={{ maxWidth: '500px', marginRight: '1px', marginBottom: '2px' }}>
          <CardHeader
            avatar={
              <UserAvatar
                image={sponsorship.user?.image}
                name={sponsorship.user?.name}
                link={sponsorship.user?.profilePath ? '/u/' + sponsorship.user.profilePath : ''}
              />
            }
            title={activeSponsorship?.title || sponsorship.title || DEFAULT_TITLE_PREFIX + sponsorship.user?.name?.split(' ')[0]}
            subheader={<SponsorshipSubTitle startDate={sponsorship.startDate} />}
            action={
              handleClose && (
                <IconButton onClick={handleClose}>
                  <ClearIcon></ClearIcon>
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
                : '90%',
            }}
            className={classes.media}
            image={sponsorship.pictureUrl + imageCacheKey}
            title={sponsorship.title}
          ></CardMedia>
          <CardContent>
            <Typography variant='body2' color='textSecondary' component='p'>
              {activeSponsorship?.description || sponsorship.description || DEFAULT_DESCRIPTION}
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
      <SponsorshipAddEditDialog
        sponsorship={activeSponsorship}
        isOpen={isEditDialogOpen}
        setIsOpen={handleDialogClose}
        setSponsorship={setActiveSponsorship}
      />
    </>
  );
};

export default SponsorshipDisplay;
