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
import { UserAvatar, DateDisplay } from 'components/sponsor';
import { DEFAULT_DESCRIPTION } from 'consts';
import { DEFAULT_TITLE_PREFIX } from 'consts';
import SponsorshipAddEditDialog from './SponsorshipAddEditDialog';
import SponsorshipActions from './SponsorshipActions';
import { getFirstName } from 'utils/user/get-first-name';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { getDisplayTitle } from 'utils/sponsorship/get-display-title';

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
        <Card sx={{ maxWidth: '500px', marginRight: handleClose ? 0 : '1px', marginBottom: handleClose ? 0 : '2px' }}>
          <CardHeader
            avatar={
              <UserAvatar
                image={sponsorship.user?.image}
                name={sponsorship.user?.displayName || sponsorship.user?.name}
                link={sponsorship.user?.profilePath ? '/u/' + sponsorship.user.profilePath : ''}
              />
            }
            title={activeSponsorship?.title || getDisplayTitle(sponsorship)}
            subheader={<DateDisplay startDate={sponsorship.startDate} />}
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
          <CardContent sx={{ flex: '1 1 100%' }}>
            <Typography variant='body2' color='textSecondary' component='p'>
              {activeSponsorship?.description || sponsorship.description || DEFAULT_DESCRIPTION}
            </Typography>
          </CardContent>
          {!isEditMode && (
            <CardActions disableSpacing sx={{ padding: 0, height: '100%', flexDirection: 'column' }}>
              <SponsorshipActions
                sponsorship={sponsorship}
                signInCallbackUrl={`/u/${sponsorship?.user?.profilePath}?t=${sponsorship?.id}`}
              />
            </CardActions>
          )}
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
                  <Box sx={{ display: 'flex', flex: '1 1 100%' }}></Box>
                  {sponsorship.isPrivate && (
                    <Tooltip title='Hidden from public view'>
                      <VisibilityOffIcon sx={{ color: 'var(--icon-button-color)', marginRight: 1 }} />
                    </Tooltip>
                  )}
                  {sponsorship.isPrivateLocation && !sponsorship.isPrivate && (
                    <Tooltip title='Location hidden from public view'>
                      <LocationOffIcon sx={{ color: 'var(--icon-button-color)', marginRight: 1 }} />
                    </Tooltip>
                  )}
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
