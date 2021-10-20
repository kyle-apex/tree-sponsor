import { Box } from '@mui/system';
import ImageIcon from '@mui/icons-material/Image';
import React, { useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';

const ImageUploadAndPreview = ({
  imageUrl,
  setImageUrl,
  maxHeight,
  maxWidth,
  hideEditButton,
  size = 'default',
}: {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  maxHeight?: number;
  maxWidth?: number;
  hideEditButton?: boolean;
  size?: 'small' | 'default';
}) => {
  const fileInputRef = useRef<HTMLInputElement>();
  //const [imageFile, setImageFile] = useState<{ type: string; content: string }>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.length) return;
    const reader = new FileReader();
    const file = e.target.files[0];
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');

    // Read the image via FileReader API and save image result in state.
    reader.onload = function (e) {
      // Add the file name to the data URL
      img.onload = () => {
        const MAX_WIDTH = maxWidth ?? 1100;
        const MAX_HEIGHT = maxHeight ?? 900;
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

        const dataUrl = canvas.toDataURL('image/jpeg');
        console.log('dataUrl', width, height, dataUrl, file.type);

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
        fileInputRef?.current?.click();
      }}
    >
      {!imageUrl && (
        <>
          <ImageIcon sx={{ color: 'lightgray', fontSize: size == 'small' ? '20px' : '50px' }}></ImageIcon>
          {size !== 'small' && <Box sx={{ color: 'gray', marginLeft: '5px' }}>Click to Add Picture</Box>}
        </>
      )}
      {imageUrl && (
        <>
          {!hideEditButton && (
            <Box alignSelf='end' sx={{ marginBottom: '-45px', zIndex: '1' }}>
              <Box
                sx={{
                  width: '35px',
                  height: '35px',
                  backgroundColor: '#9c9c9c',
                  borderRadius: '50%',
                  border: 'solid 1px white',
                  marginRight: '10px',
                  float: 'right',
                  textAlign: 'center',
                }}
              >
                <EditIcon sx={{ color: 'white', marginTop: '3px' }} />
              </Box>
            </Box>
          )}

          <img src={imageUrl} className='full-width'></img>
        </>
      )}
      <input type='file' ref={fileInputRef} accept='image/*' className='hide' onChange={onSelectFile} />
    </Box>
  );
};

export default ImageUploadAndPreview;
