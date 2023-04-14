/* eslint-disable react/display-name */
import ImageIcon from '@mui/icons-material/Image';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import CornerEditIcon from './tree/CornerEditIcon';

type FileBrowserHandle = {
  openFileBrowser: () => void;
};

const ImageUploadAndPreview = forwardRef(
  (
    {
      imageUrl,
      setImageUrl,
      maxHeight,
      maxWidth,
      hideEditButton,
      size = 'default',
      addSubtitleText = 'Click to Add Picture',
    }: {
      imageUrl: string;
      setImageUrl: (val: string) => void; //React.Dispatch<React.SetStateAction<string>>;
      maxHeight?: number;
      maxWidth?: number;
      hideEditButton?: boolean;
      size?: 'small' | 'default';
      addSubtitleText?: string;
    },
    ref: React.Ref<FileBrowserHandle>,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>();
    //const [imageFile, setImageFile] = useState<{ type: string; content: string }>();
    useImperativeHandle(ref, () => ({
      openFileBrowser() {
        fileInputRef?.current?.click();
      },
    }));
    const openFileBrowser = () => {
      fileInputRef?.current?.click();
    };
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e?.target?.files?.length) return;
      const reader = new FileReader();
      const file = e.target.files[0];
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        if (!e?.target?.result) return;

        // Add the file name to the data URL
        img.onload = () => {
          const MAX_WIDTH = maxWidth ?? 1600;
          const MAX_HEIGHT = maxHeight ?? 1600;
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
          if (ctx) ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg');

          setImageUrl(dataUrl);
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
          flexDirection: 'column',
        }}
        component='div'
        onClick={() => {
          openFileBrowser(); //fileInputRef?.current?.click();
        }}
      >
        {!imageUrl && (
          <>
            <ImageIcon sx={{ color: 'lightgray', fontSize: size == 'small' ? '20px' : '50px' }}></ImageIcon>
            {size !== 'small' && <Box sx={{ color: 'gray', marginLeft: '5px' }}>{addSubtitleText}</Box>}
          </>
        )}
        {imageUrl && (
          <>
            {!hideEditButton && <CornerEditIcon />}

            <img
              src={imageUrl}
              className='full-width'
              alt='Preview'
              onError={(e: any) => {
                setTimeout(() => {
                  if (e.target && e.target.src && e.target.src.startsWith('http')) {
                    e.target.src = e.target.src.includes('?') ? imageUrl + '1' : imageUrl + '?t=' + new Date().getTime();
                  }
                }, 2000);
              }}
            ></img>
          </>
        )}
        <input
          name='fileUpload'
          title='File Upload'
          type='file'
          ref={fileInputRef}
          accept='image/*'
          className='hide'
          onChange={onSelectFile}
        />
      </Box>
    );
  },
);

export default ImageUploadAndPreview;
