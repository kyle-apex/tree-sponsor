import { Box } from '@mui/system';
import ImageIcon from '@mui/icons-material/Image';
import React, { useState, useRef } from 'react';
import Image from 'next/image';

const ImageUploadAndPreview = ({
  setImageFile,
}: {
  setImageFile: React.Dispatch<
    React.SetStateAction<{
      type: string;
      content: string;
    }>
  >;
}) => {
  const fileInputRef = useRef<HTMLInputElement>();
  const [imageUrl, setImageUrl] = useState('');
  //const [imageFile, setImageFile] = useState<{ type: string; content: string }>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('inonselectfile');
    if (!e?.target?.files?.length) return;
    const reader = new FileReader();
    const file = e.target.files[0];
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');

    // Read the image via FileReader API and save image result in state.
    reader.onload = function (e) {
      // Add the file name to the data URL
      console.log('result', e.target.result);
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL();
        console.log('dataUrl', width, height, dataUrl);

        setImageUrl(dataUrl);
        setImageFile({ type: file.type, content: dataUrl.split(',')[1] });
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
      }}
      component='div'
      onClick={() => {
        fileInputRef?.current?.click();
      }}
    >
      {!imageUrl && (
        <>
          <ImageIcon sx={{ color: 'lightgray', fontSize: '50px' }}></ImageIcon>
          <Box sx={{ color: 'gray', marginLeft: '5px' }}>Click to Add Picture</Box>
        </>
      )}
      {imageUrl && (
        <>
          <img src={imageUrl} className='full-width'></img>
        </>
      )}
      <input type='file' ref={fileInputRef} accept='image/*' className='hide' onChange={onSelectFile} />
    </Box>
  );
};

export default ImageUploadAndPreview;
