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
import React, { SetStateAction, useState } from 'react';
import { PartialTree } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import Box from '@mui/material/Box';
import SpeciesQuiz from './SpeciesQuiz';
import Button from '@mui/material/Button';
import PhotoViewDialog from 'components/PhotoViewDialog';
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
}: {
  tree?: PartialTree;
  isEditMode?: boolean;
  onDelete?: (id: number) => void;
  handleClose?: () => void;
  hasFullHeightImage?: boolean;
  title?: string;
}) => {
  const classes = useStyles();

  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTree, setActiveTree] = useState<PartialTree>();
  const [imageCacheKey, setImageCacheKey] = useState('');
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);

  const handleDialogClose = (isOpen: SetStateAction<boolean>) => {
    setIsEditDialogOpen(isOpen);
    if (!isOpen) setImageCacheKey('?cacheKey=' + new Date().getTime());
  };

  const nextImage = () => {
    setDisplayedImageIndex(idx => {
      idx++;
      if (idx >= tree.images.length) idx = 0;
      return idx;
    });
  };

  const prevImage = () => {
    setDisplayedImageIndex(idx => {
      idx--;
      if (idx < 0) idx = tree.images.length - 1;
      return idx;
    });
  };

  const image = tree?.images?.length > 0 ? tree.images[displayedImageIndex] : null;

  let displayName;

  if (tree?.species?.name) {
    displayName = tree?.name ? `${tree.name} | ${tree.species.name}` : tree.species.name;
  } else {
    displayName = tree.name;
  }
  const imagePaddingTop = hasFullHeightImage ? (image.height ? (image.height / image.width) * 100 + '%' : '90%') : '90%';
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
            }}
            className={classes.media}
            image={image.url + imageCacheKey}
            title={tree.name}
            onClick={() => {
              setIsPhotoViewOpen(true);
            }}
          >
            {tree?.images?.length > 1 && (
              <IconButton aria-label='share' size='large' sx={{ top: '50%', right: 0, position: 'absolute' }} onClick={nextImage}>
                <ChevronRight />
              </IconButton>
            )}
            {tree?.images?.length > 1 && (
              <IconButton aria-label='share' size='large' sx={{ top: '50%', left: 0, position: 'absolute' }} onClick={prevImage}>
                <ChevronLeft />
              </IconButton>
            )}
          </CardMedia>
          <PhotoViewDialog imageUrl={image.url} open={isPhotoViewOpen} setOpen={setIsPhotoViewOpen}></PhotoViewDialog>
          {hasSpeciesQuiz && (
            <CardContent sx={{ flex: '1 1 100%', background: 'url(/background-lighter.svg)' }}>
              <Typography variant='h6' color='secondary' sx={{ textAlign: 'center' }} mb={2}>
                Tree ID Quiz
              </Typography>
              <Typography variant='body2' mt={-2} mb={2} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
                Click below to guess a species:
              </Typography>
              <SpeciesQuiz correctSpecies={tree.species}></SpeciesQuiz>
              <Button fullWidth color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
                Close
              </Button>
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
