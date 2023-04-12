import { ReviewStatusSelect } from 'components/ReviewStatusSelect';
import React, { useCallback, useState } from 'react';
import { ReviewStatus, PartialTree } from 'interfaces';
import TreeFormFields from 'components/tree/TreeFormFields';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import LocationSelectorDialog from 'components/location/LocationSelectorDialog';
import { Decimal } from '@prisma/client/runtime';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import MapIcon from '@mui/icons-material/MapOutlined';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIconButton from 'components/DeleteIconButton';
import getImageDimensions from 'utils/aws/get-image-dimensions';
import CornerEditIcon from './CornerEditIcon';
import PreviewAndReorderImagesDialog from './PreviewAndReorderImagesDialog';

type Mode = 'Image' | 'Map';

const TreeReview = ({
  tree,
  onUpdate,
  onDelete,
  onDeleteImage,
  isAdmin,
}: {
  tree: PartialTree;
  onUpdate: (id: number, attributes: Record<string, unknown>) => void;
  onDelete?: (id: number) => void;
  onDeleteImage?: (uuid: string) => void;
  isAdmin?: boolean;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('Image');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  //const { onUpdate } = useUpdateQueryById(apiKey, updateTree, false, 500);
  // TODO refactor into memoized component to avoid re-render all when updating
  return (
    <>
      <ToggleButtonGroup
        size='small'
        value={mode}
        exclusive
        onChange={(_e, mode) => setMode(mode)}
        aria-label='Image/Map Mode'
        fullWidth
        sx={{ marginBottom: -0.2 }}
      >
        <ToggleButton value='Image' aria-label='Image'>
          <ImageIcon />
        </ToggleButton>
        <ToggleButton value='Map' aria-label='Location'>
          <MapIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      {mode == 'Image' && !tree.pictureUrl && (
        <ImageUploadAndPreview
          imageUrl={tree.pictureUrl}
          setImageUrl={async (imageUrl: string) => {
            tree.pictureUrl = imageUrl;
            onUpdate(tree.id, { pictureUrl: imageUrl });
          }}
        />
      )}
      {mode == 'Image' && tree.pictureUrl && (
        <>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f1f1f1',
              cursor: 'pointer',
              flexDirection: 'column',
            }}
            component='div'
            onClick={() => {
              setImageDialogOpen(true);
            }}
          >
            <CornerEditIcon
              onClick={() => {
                setImageDialogOpen(true);
              }}
            />
            <img src={tree.pictureUrl} className='full-width' alt='Preview'></img>
          </Box>
          <PreviewAndReorderImagesDialog
            isOpen={imageDialogOpen}
            setIsOpen={setImageDialogOpen}
            treeId={tree.id}
            images={tree.images}
            onAdd={async (imageUrl: string) => {
              if (!tree.images?.length) tree.pictureUrl = imageUrl;
              onUpdate(tree.id, { pictureUrl: imageUrl });
            }}
            onDelete={onDeleteImage}
          ></PreviewAndReorderImagesDialog>
        </>
      )}
      {mode == 'Map' && (
        <>
          <Box sx={{ minHeight: '200px', position: 'relative' }}>
            <MapMarkerDisplay
              markers={[{ latitude: Number(tree.latitude), longitude: Number(tree.longitude) }]}
              height='200px'
              onClick={() => {
                setDialogOpen(true);
              }}
              mapStyle='SATELLITE'
              markerScale={0.5}
              isQuiz={!tree.latitude}
              isEdit={true}
            ></MapMarkerDisplay>
          </Box>
          <LocationSelectorDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            latitude={Number(tree.latitude)}
            longitude={Number(tree.longitude)}
            onSave={({ latitude, longitude }) => {
              tree.latitude = (latitude + '') as unknown as Decimal;
              tree.longitude = (longitude + '') as unknown as Decimal;
              onUpdate(tree.id, { latitude, longitude });
            }}
          ></LocationSelectorDialog>
        </>
      )}
      <Box mt={1} sx={{ padding: 2 }}>
        <TreeFormFields
          tree={tree}
          handleChange={(propertyName: string, value) => {
            onUpdate(tree.id, { [propertyName]: value });
            if (propertyName == 'speciesId') tree.speciesId = value as number;
          }}
        ></TreeFormFields>
        {isAdmin && (
          <ReviewStatusSelect
            label='Review Status'
            value={tree.reviewStatus}
            onChange={(value: ReviewStatus) => {
              if (value !== '') {
                tree.reviewStatus = value;
                onUpdate(tree.id, { reviewStatus: value });
              }
            }}
            mb={2}
          />
        )}
        {onDelete && <DeleteIconButton itemType='tree' title='Delete Tree?' onDelete={() => onDelete(tree.id)}></DeleteIconButton>}
      </Box>
    </>
  );
};
export default TreeReview;
