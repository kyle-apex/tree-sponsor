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
import { PartialTree } from 'interfaces';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import Box from '@mui/material/Box';
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
}: {
  tree?: PartialTree;
  isEditMode?: boolean;
  onDelete?: (id: number) => void;
  handleClose?: () => void;
  hasFullHeightImage?: boolean;
}) => {
  const classes = useStyles();

  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTree, setActiveTree] = useState<PartialTree>();
  const [imageCacheKey, setImageCacheKey] = useState('');

  const handleDialogClose = (isOpen: SetStateAction<boolean>) => {
    setIsEditDialogOpen(isOpen);
    if (!isOpen) setImageCacheKey('?cacheKey=' + new Date().getTime());
  };

  const image = tree?.images?.length > 0 ? tree.images[0] : null;

  let displayName;

  if (tree?.species?.name) {
    displayName = tree?.name ? `${tree.name} | ${tree.species.name}` : tree.species.name;
  } else {
    displayName = tree.name;
  }

  return (
    <>
      {tree?.id && (
        <Card sx={{ maxWidth: '500px', marginRight: handleClose ? 0 : '1px', marginBottom: handleClose ? 0 : '2px' }}>
          <CardHeader
            title={displayName}
            subheader={<Typography>{tree.location?.name}</Typography>}
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
              paddingTop: hasFullHeightImage ? (image.height ? (image.height / image.width) * 100 + '%' : '90%') : '90%',
            }}
            className={classes.media}
            image={image.url + imageCacheKey}
            title={tree.name}
          ></CardMedia>
          <CardContent sx={{ flex: '1 1 100%' }}>
            <Typography variant='body2' color='textSecondary' component='p'>
              Tree Details
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
