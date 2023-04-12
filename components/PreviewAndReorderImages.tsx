import Grid from '@mui/material/Grid';
import { PartialTreeImage } from 'interfaces';
import Image from 'next/image';
import axios from 'axios';

import ImageUploadAndPreview from './ImageUploadAndPreview';
import DeleteIconButton from './DeleteIconButton';
import Box from '@mui/material/Box';

const PreviewAndReorderImages = ({
  images,
  onAdd,
  onDelete,
}: {
  images: PartialTreeImage[];
  onAdd?: (imageUrl: string) => void;
  onDelete?: (uuid: string) => void;
}) => {
  /*const addImage = async (imageUrl: string) => {
    const updatedTree = await axios.post('/api/trees', { pictureUrl: imageUrl, id: treeId });
  };*/
  return (
    <Grid container spacing={4}>
      {images.map(image => {
        return (
          <Grid item xs={12} sm={6} md={3} key={image.uuid}>
            <Box sx={{ position: 'relative', width: '80px', height: '80px', marginLeft: 'auto', marginRight: 'auto' }}>
              <Box sx={{ position: 'absolute', top: '0px', width: '100%', height: '100%' }}>
                <Image width='100%' height='100%' src={image?.url}></Image>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: 'solid 1px gray',
                }}
              >
                <DeleteIconButton title='Remove Image' itemType='tree image' onDelete={() => onDelete(image.uuid)}></DeleteIconButton>
              </Box>
            </Box>
          </Grid>
        );
      })}
      <Grid item xs={12} sm={6} md={3}>
        <Box sx={{ position: 'relative', width: '100%', height: '80px' }}>
          <ImageUploadAndPreview
            imageUrl=''
            setImageUrl={(imageUrl: string) => {
              if (onAdd) onAdd(imageUrl);
            }}
            addSubtitleText='Add'
          />
        </Box>
      </Grid>
    </Grid>
  );
};
export default PreviewAndReorderImages;
