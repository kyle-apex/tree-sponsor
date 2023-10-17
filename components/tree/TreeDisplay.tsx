import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/Clear';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { SetStateAction, useContext, useMemo, useState } from 'react';
import { PartialTree } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import Box from '@mui/material/Box';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SpeciesQuiz from './SpeciesQuiz';
import Button from '@mui/material/Button';
import PhotoViewDialog from 'components/PhotoViewDialog';
import { useSwipeable } from 'react-swipeable';
import MobileStepper from '@mui/material/MobileStepper';
import useTheme from '@mui/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import QuizContext from './QuizContext';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// TODO
const useStyles = makeStyles(() => ({
  media: {
    height: 0,
  },
}));

const TreeDisplay = ({
  tree,
  isEditMode,
  onDelete,
  handleClose,
  hasFullHeightImage,
  title,
  eventId,
  onNextTree,
}: {
  tree?: PartialTree;
  isEditMode?: boolean;
  onDelete?: (id: number) => void;
  handleClose?: React.MouseEventHandler<HTMLButtonElement>;
  hasFullHeightImage?: boolean;
  title?: string;
  eventId?: number;
  onNextTree?: (isPrev?: boolean) => void;
}) => {
  const classes = useStyles();

  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTree, setActiveTree] = useState<PartialTree>();
  const [imageCacheKey, setImageCacheKey] = useState('');
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const [activePhotoUrl, setActivePhotoUrl] = useState('');

  const quizContext = useContext(QuizContext);
  const hasNavigation = quizContext?.event?.hasNavigation;

  const handleDialogClose = (isOpen: SetStateAction<boolean>) => {
    setIsEditDialogOpen(isOpen);
    if (!isOpen) setImageCacheKey('?cacheKey=' + new Date().getTime());
  };

  const nextImage: React.MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();

    setDisplayedImageIndex(idx => {
      idx++;
      if (idx >= tree.images.length) idx = 0;
      return idx;
    });
  };

  const theme = useTheme();

  const isMobile = !useMediaQuery(theme.breakpoints.up(500));

  const prevImage: React.MouseEventHandler<HTMLButtonElement> = e => {
    e?.stopPropagation();
    setDisplayedImageIndex(idx => {
      idx--;
      if (idx < 0) idx = tree.images.length - 1;
      return idx;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(null),
    onSwipedRight: () => prevImage(null),
  });

  const image = tree?.images?.length > 0 ? tree.images[displayedImageIndex] : null;

  const leafImage = tree?.images?.find(image => image.isLeaf);

  let displayName;

  if (tree?.species?.name) {
    displayName = tree?.name ? `${tree.name} | ${tree.species.name}` : tree.species.name;
  } else {
    displayName = tree.name;
  }
  const imagePaddingTop = hasFullHeightImage ? (image?.height ? (image.height / image.width) * 100 + '%' : '90%') : '90%';
  const hasSpeciesQuiz = !!tree.species;
  return (
    <>
      {tree?.id && (
        <Card sx={{ maxWidth: '500px', marginRight: handleClose ? 0 : '1px', marginBottom: handleClose ? 0 : '2px' }}>
          {!hasSpeciesQuiz && (
            <CardHeader
              title={title || displayName}
              subheader={<Typography>{tree.location?.name}</Typography>}
              action={
                handleClose && (
                  <IconButton onClick={handleClose}>
                    <ClearIcon></ClearIcon>
                  </IconButton>
                )
              }
            />
          )}
          <CardMedia
            sx={{
              paddingTop: `min(45vh,${imagePaddingTop})`,
              position: 'relative',
              cursor: 'pointer',
            }}
            className={classes.media + ' box-shadow'}
            image={image?.url + imageCacheKey}
            title={tree.name}
            onClick={() => {
              setActivePhotoUrl(image.url);
              setIsPhotoViewOpen(true);
            }}
            {...swipeHandlers}
          >
            <IconButton
              onClick={() => {
                setActivePhotoUrl(image?.url);
                setIsPhotoViewOpen(true);
              }}
              sx={{ left: 5, top: 5 }}
              className='hoverImageIconButton'
            >
              <FullscreenIcon></FullscreenIcon>
            </IconButton>
            {handleClose && (
              <IconButton onClick={handleClose} sx={{ right: 5, top: 5 }} className='hoverImageIconButton'>
                <ClearIcon></ClearIcon>
              </IconButton>
            )}
            {tree?.images?.length > 1 && (
              <IconButton
                aria-label='share'
                sx={{ top: '50%', right: 5, zIndex: 1001 }}
                className='hoverImageIconButton'
                onClick={nextImage}
              >
                <ChevronRight />
              </IconButton>
            )}
            {leafImage && (
              <Box
                sx={{
                  border: 'solid 2px #f1f1f1',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: 5,
                  top: 'calc(100% - 70px)',
                  zIndex: 1001,
                  width: '120px',
                  height: '120px',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                className='box-shadow'
                onClick={e => {
                  e.stopPropagation();
                  setActivePhotoUrl(leafImage.url);
                  setIsPhotoViewOpen(true);
                }}
              >
                <img alt='Leaf' src={leafImage.url} style={{ width: '100%', height: '100%' }} className='box-shadow'></img>
              </Box>
            )}
            {tree?.images?.length > 1 && (
              <>
                <IconButton aria-label='share' sx={{ top: '50%', left: 5 }} className='hoverImageIconButton' onClick={prevImage}>
                  <ChevronLeft />
                </IconButton>
                <MobileStepper
                  sx={{
                    bottom: '0px',
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    justifyContent: 'center',
                    '.MuiMobileStepper-dot': {
                      alignSelf: 'center',
                      height: '7px',
                      width: '7px',
                      backgroundColor: 'rgba(175, 175, 175, 0.7)',
                    },
                    '.MuiMobileStepper-dotActive': {
                      backgroundColor: 'white !important',
                    },
                    '.MuiMobileStepper-dots': {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '6px',
                      padding: '3px 6px',
                    },
                  }}
                  steps={tree?.images?.length}
                  activeStep={displayedImageIndex}
                  onClick={e => {
                    e.stopPropagation();
                    nextImage(null);
                  }}
                  backButton={<></>}
                  nextButton={<></>}
                ></MobileStepper>
              </>
            )}
          </CardMedia>
          <PhotoViewDialog imageUrl={activePhotoUrl} open={isPhotoViewOpen} setOpen={setIsPhotoViewOpen}></PhotoViewDialog>

          {hasSpeciesQuiz && (
            <CardContent sx={{ flex: '1 1 100%', background: 'url(/background-lighter.svg)' }}>
              {hasNavigation && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: isMobile && leafImage ? '10px' : '16px',
                    borderBottom: 'solid 1px lightgray',
                    marginBottom: '10px',
                  }}
                >
                  <Typography>Navigate{isMobile && leafImage ? '' : ' to tree'}:</Typography>
                  <a
                    target='_blank'
                    href={`https://www.google.com/maps/dir/?api=1&travelmode=walking&layer=walking&destination=${tree?.latitude},${tree?.longitude}`}
                    rel='noreferrer'
                  >
                    <DirectionsWalkIcon></DirectionsWalkIcon>
                  </a>
                  <a
                    target='_blank'
                    href={`https://www.google.com/maps/dir/?api=1&travelmode=bicycling&layer=bicycling&destination=${tree?.latitude},${tree?.longitude}`}
                    rel='noreferrer'
                  >
                    <DirectionsBikeIcon></DirectionsBikeIcon>
                  </a>
                  <a
                    target='_blank'
                    href={`https://www.google.com/maps/dir/?api=1&travelmode=walking&layer=traffic&destination=${tree?.latitude},${tree?.longitude}`}
                    rel='noreferrer'
                    style={{ marginLeft: '2px' }}
                  >
                    <DirectionsCarIcon></DirectionsCarIcon>
                  </a>
                </Box>
              )}
              <SpeciesQuiz
                correctSpecies={tree.species}
                treeId={tree.id}
                eventId={eventId}
                subtitleSx={{ textAlign: isMobile && leafImage ? 'left' : 'center' }}
                hasLeaf={!!leafImage}
                onClose={handleClose}
                onNextTree={onNextTree}
              ></SpeciesQuiz>

              {handleClose && (
                <Button fullWidth color='inherit' sx={{ mt: 2 }} onClick={handleClose}>
                  Close
                </Button>
              )}
            </CardContent>
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
                      setActiveTree(tree);
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
                      onDelete(tree.id);
                    }}
                  ></DeleteConfirmationDialog>
                </>
              )}
            </CardActions>
          )}
        </Card>
      )}
    </>
  );
};

export default TreeDisplay;
