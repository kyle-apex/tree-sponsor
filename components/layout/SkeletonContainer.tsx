import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { SxProps, Theme } from '@mui/material/styles';

const SkeletonContainer = ({
  height,
  sx,
  onClick,
  children,
}: {
  height: number;
  sx: SxProps<Theme>;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <Skeleton variant='rectangular' height={height} sx={sx}></Skeleton>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          textAlign: 'center',
          top: 0,
          bottom: 0,
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '8%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default SkeletonContainer;
