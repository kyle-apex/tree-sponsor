/* eslint-disable react/display-name */
import ImageIcon from '@mui/icons-material/Image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import CornerEditIcon from './tree/CornerEditIcon';
import ImageSelector from './ImageSelector';

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
      previewHeight,
    }: {
      imageUrl: string;
      setImageUrl: (val: string) => void; //React.Dispatch<React.SetStateAction<string>>;
      maxHeight?: number;
      maxWidth?: number;
      hideEditButton?: boolean;
      size?: 'small' | 'default';
      addSubtitleText?: string;
      previewHeight?: string;
    },
    ref: React.Ref<FileBrowserHandle>,
  ) => {
    const imageSelectorRef = useRef<React.ElementRef<typeof ImageSelector>>(null);

    //const [imageFile, setImageFile] = useState<{ type: string; content: string }>();
    useImperativeHandle(ref, () => ({
      openFileBrowser() {
        imageSelectorRef.current.openFileBrowser();
      },
    }));

    return (
      <ImageSelector
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        sx={{
          display: 'flex',
          width: '100%',
          height: !imageUrl && previewHeight ? previewHeight : '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f1f1f1',
          cursor: 'pointer',
          flexDirection: 'column',
        }}
        ref={imageSelectorRef}
      >
        <>
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
        </>
      </ImageSelector>
    );
  },
);

export default ImageUploadAndPreview;
