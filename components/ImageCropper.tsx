/* eslint-disable react/display-name */
import ImageIcon from '@mui/icons-material/Image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import CornerEditIcon from './tree/CornerEditIcon';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import { SxProps, Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';

type CropResult = { base64Image: string; height: number; width: number };
export type FileBrowserHandle = {
  openFileBrowser: () => void;
  doCrop: () => CropResult;
};

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number, percentage?: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: percentage || 70,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper = forwardRef(
  (
    {
      imageUrl,
      setImageUrl,
      maxHeight,
      maxWidth,
      hideEditButton,
      size = 'default',
      addSubtitleText = 'Tap to Add Picture',
      previewSx = {},
      onCrop,
      imageRef,
    }: {
      imageUrl: string;
      setImageUrl: (val: string) => void; //React.Dispatch<React.SetStateAction<string>>;
      maxHeight?: number;
      maxWidth?: number;
      hideEditButton?: boolean;
      size?: 'small' | 'default';
      addSubtitleText?: string;
      previewSx?: SxProps<Theme>;
      onCrop?: (crop: Crop) => void;
      imageRef?: any;
    },
    ref: React.Ref<FileBrowserHandle>,
  ) => {
    const [keepSelection, setKeepSelection] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isCropping, setIsCropping] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>();
    //const [imageFile, setImageFile] = useState<{ type: string; content: string }>();
    useImperativeHandle(ref, () => ({
      openFileBrowser() {
        fileInputRef?.current?.click();
      },
      doCrop(): CropResult {
        // create a canvas element to draw the cropped image
        const canvas = document.createElement('canvas');

        // get the image element
        const image = imageRef.current;
        const currentCrop = completedCrop;

        // draw the image on the canvas
        if (image) {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;
          const ctx = canvas.getContext('2d');
          const pixelRatio = 1; //window.devicePixelRatio;
          canvas.width = currentCrop.width * pixelRatio * scaleX;
          canvas.height = currentCrop.height * pixelRatio * scaleY;

          if (ctx) {
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
              image,
              currentCrop.x * scaleX,
              currentCrop.y * scaleY,
              currentCrop.width * scaleX,
              currentCrop.height * scaleY,
              0,
              0,
              currentCrop.width * scaleX,
              currentCrop.height * scaleY,
            );
          }

          const base64Image = canvas.toDataURL('image/jpeg', 1); // can be changed to jpeg/jpg etc
          return { base64Image, width: canvas.width, height: canvas.height };
        }
      },
    }));

    useEffect(() => {
      if (imageUrl && imageRef?.current?.width && !imageUrl.startsWith('http')) {
        setCrop(centerAspectCrop(imageRef.current.width, imageRef.current.height, 1, 100));
      }
      setTimeout(() => {
        console.log('width', imageRef?.current.width);
      }, 400);
    }, []);

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
          setTimeout(() => {
            setCrop(centerAspectCrop(width, height, 1, 100));
          });

          setIsCropping(true);
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    };

    return (
      <>
        {(!imageUrl || imageUrl?.startsWith('http')) && (
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

              ...previewSx,
            }}
            className='box-shadow'
            component='div'
            onClick={() => {
              if (!isCropping) openFileBrowser(); //fileInputRef?.current?.click();
            }}
          >
            {!imageUrl && (
              <>
                <ImageIcon sx={{ color: 'lightgray', fontSize: size == 'small' ? '20px' : '50px' }}></ImageIcon>
                {size !== 'small' && <Box sx={{ color: 'gray', paddingLeft: 1.5, paddingRight: 1.5 }}>{addSubtitleText}</Box>}
              </>
            )}
            {imageUrl?.startsWith('http') && (
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
          </Box>
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
        {imageUrl && !imageUrl.startsWith('http') && (
          <>
            {!hideEditButton && false && <CornerEditIcon />}
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => {
                setCompletedCrop(c);
                if (c && onCrop) onCrop(c);
              }}
              aspect={1}
              keepSelection={keepSelection}
            >
              <img
                src={imageUrl}
                alt='Preview'
                ref={imageRef}
                onError={(e: any) => {
                  setTimeout(() => {
                    if (e.target && e.target.src && e.target.src.startsWith('http')) {
                      e.target.src = e.target.src.includes('?') ? imageUrl + '1' : imageUrl + '?t=' + new Date().getTime();
                    }
                  }, 2000);
                }}
              ></img>
            </ReactCrop>
          </>
        )}
      </>
    );
  },
);

export const ImageCropperWrapper = ({
  subtitle,
  croppedImage,
  setCroppedImage,
}: {
  subtitle: string;
  croppedImage: string;
  setCroppedImage: (val: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const imageCropperRef = useRef<FileBrowserHandle>();
  const imageRef = useRef<any>();

  const doCrop = async () => {
    const { base64Image } = imageCropperRef?.current?.doCrop();
    setCroppedImage(base64Image);
  };
  return (
    <Box sx={{ textAlign: 'center' }}>
      {!croppedImage && (
        <ImageCropper
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          ref={imageCropperRef}
          imageRef={imageRef}
          addSubtitleText='Tap to add a picture of a leaf or two for identification suggestions'
          previewSx={{ borderRadius: '50%', maxWidth: '100%', width: '200px', height: '200px', margin: '20px auto' }}
        ></ImageCropper>
      )}
      {croppedImage && (
        <img
          alt='Cropped Image'
          src={croppedImage}
          style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto', flex: '1 0 200px' }}
        ></img>
      )}

      {!croppedImage && (
        <Button fullWidth variant='contained' color='primary' sx={{ mt: 3 }} onClick={doCrop} disabled={!imageUrl}>
          Crop
        </Button>
      )}
    </Box>
  );
};

export default ImageCropper;
