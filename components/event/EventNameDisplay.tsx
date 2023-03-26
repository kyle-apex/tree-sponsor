import Typography from '@mui/material/Typography';

const EventNameDisplay = ({ name }: { name: string }) => {
  return (
    <Typography variant='subtitle1' color='secondary' sx={{ lineHeight: 'normal' }}>
      {name}
    </Typography>
  );
};
export default EventNameDisplay;
