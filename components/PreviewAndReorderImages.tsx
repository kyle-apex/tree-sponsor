import Grid from '@mui/material/Grid';
import { PartialTreeImage } from 'interfaces';
import Image from 'next/image';
import axios from 'axios';

import ImageUploadAndPreview from './ImageUploadAndPreview';
import DeleteIconButton from './DeleteIconButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const PreviewAndReorderImages = ({
  images,
  onAdd,
  onDelete,
  onMakePrimaryImage,
}: {
  images: PartialTreeImage[];
  onAdd?: (imageUrl: string) => void;
  onDelete?: (uuid: string) => void;
  onMakePrimaryImage?: (index: number) => void;
}) => {
  /*const addImage = async (imageUrl: string) => {
    const updatedTree = await axios.post('/api/trees', { pictureUrl: imageUrl, id: treeId });
  };*/
  const [newImageUrl, setNewImageUrl] = useState('');
  useEffect(() => {
    setNewImageUrl('');
  }, [images.length]);
  return (
    <Grid container spacing={4}>
      {images.map((image, idx) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={image.uuid}>
            <Box sx={{ position: 'relative', width: '90px', height: '90px', marginLeft: 'auto', marginRight: 'auto' }}>
              <Box sx={{ position: 'absolute', top: '0px', width: '100%', height: '100%' }}>
                <Image width='100%' height='100%' src={image?.url}></Image>
              </Box>
              {images.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    border: 'solid 1px gray',
                  }}
                >
                  <IconButton
                    size='small'
                    title={idx == 0 ? 'Primary Image' : 'Make Primary Image'}
                    onClick={() => {
                      console.log('whatever');
                    }}
                    sx={{ backgroundColor: theme => (idx == 0 ? theme.palette.primary.main : 'white') }}
                  >
                    {idx == 0 && <StarIcon sx={{ fontSize: '1.2rem', color: 'white' }}></StarIcon>}
                    {idx > 0 && <StarBorderIcon sx={{ fontSize: '1.2rem' }}></StarBorderIcon>}
                  </IconButton>
                </Box>
              )}
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
      <Grid item xs={12} sm={6} md={4}>
        <Box sx={{ position: 'relative', width: '90px', height: '90px', overflow: 'hidden' }}>
          <ImageUploadAndPreview
            imageUrl={newImageUrl}
            setImageUrl={(imageUrl: string) => {
              if (onAdd) onAdd(imageUrl);
              setNewImageUrl(imageUrl);
            }}
            hideEditButton={true}
            addSubtitleText='Add'
          />
          {newImageUrl && (
            <Box
              sx={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                zIndex: 5,
                backgroundColor: 'black',
                opacity: 0.5,
              }}
            ></Box>
          )}
          {newImageUrl && (
            <CircularProgress sx={{ position: 'absolute', left: '15px', top: '15px', zIndex: 10 }} size='60px'></CircularProgress>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
export default PreviewAndReorderImages;
