import Box from '@mui/material/Box';
import { PartialTreeImage } from 'interfaces';
import Image from 'next/image';

const PreviewAndReorderImages = ({ images }: { images: PartialTreeImage[] }) => {
  return (
    <Box>
      {images.map(image => {
        <Box>
          <Image width='50px' height='50px' src={image?.url}></Image>
        </Box>;
      })}
    </Box>
  );
};
export default PreviewAndReorderImages;
