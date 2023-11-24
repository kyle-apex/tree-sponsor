/* eslint-disable react/display-name */
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

type FileBrowserHandle = {
  openFileBrowser: () => void;
};

const ImageSelector = forwardRef(
  (
    {
      imageUrl,
      setImageUrl,
      sx,
      children,
      maxHeight,
      maxWidth,
    }: {
      imageUrl: string;
      setImageUrl: (val: string) => void;
      sx?: SxProps<Theme>;
      children?: ReactNode;
      maxHeight?: number;
      maxWidth?: number;
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
    useEffect(() => {
      if (!imageUrl && fileInputRef?.current) fileInputRef.current.value = '';
    }, [imageUrl]);
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
        sx={sx}
        component='div'
        onClick={() => {
          openFileBrowser(); //fileInputRef?.current?.click();
        }}
      >
        {children}
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

export default ImageSelector;
