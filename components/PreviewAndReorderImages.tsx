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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

const PreviewAndReorderImages = ({
  images,
  selectedIndex,
  setSelectedIndex,
  onAdd,
  onDelete,
}: {
  images: PartialTreeImage[];
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  onAdd?: (imageUrl: string) => void;
  onDelete?: (uuid: string) => void;
}) => {
  /*const addImage = async (imageUrl: string) => {
    const updatedTree = await axios.post('/api/trees', { pictureUrl: imageUrl, id: treeId });
  };*/
  const [newImageUrl, setNewImageUrl] = useState('');
  //const [selectedIndex, setSelectedIndex] = useState<number>();
  useEffect(() => {
    setNewImageUrl('');
  }, [images.length]);
  return (
    <Grid container spacing={4}>
      {images.map((image, idx) => {
        return (
          <Grid item xs={6} sm={4} md={4} key={image.uuid}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                border: idx === selectedIndex ? 'solid 3px #139CF7' : 'none',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '0px',
                  width: '100%',
                  height: '100%',
                }}
              >
                <img
                  src={image?.url}
                  className='full-width'
                  style={{ aspectRatio: '1 / 1' }}
                  alt='Preview'
                  onClick={_e => {
                    if (idx !== selectedIndex) setSelectedIndex(idx);
                    else setSelectedIndex(null);
                  }}
                ></img>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                }}
              >
                {idx === selectedIndex && (
                  <CircleIcon sx={{ position: 'absolute', color: 'white', zIndex: 0, left: '9px', top: '9px' }}></CircleIcon>
                )}
                <Checkbox
                  checked={idx === selectedIndex}
                  onChange={e => {
                    if (e.target.checked) setSelectedIndex(idx);
                    else setSelectedIndex(null);
                  }}
                  icon={<RadioButtonUncheckedIcon sx={{ opacity: 0.6, color: 'lightgray' }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: '#139CF7' }} />}
                />
              </Box>
              {false && (
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
              )}
            </Box>
          </Grid>
        );
      })}
      <Grid item xs={6} sm={4} md={4}>
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
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
