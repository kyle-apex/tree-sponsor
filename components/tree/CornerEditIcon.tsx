import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

const CornerEditIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Box alignSelf='end' sx={{ marginBottom: '-45px', zIndex: '1' }} onClick={onClick}>
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
          marginTop: '10px',
          cursor: 'pointer',
        }}
      >
        <EditIcon sx={{ color: 'white', marginTop: '3px' }} />
      </Box>
    </Box>
  );
};
export default CornerEditIcon;
