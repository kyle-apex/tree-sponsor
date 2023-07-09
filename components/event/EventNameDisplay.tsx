import Typography from '@mui/material/Typography';

const EventNameDisplay = ({ name, isRecap }: { name: string; isRecap?: boolean }) => {
  return (
    <Typography variant='subtitle1' color='secondary' sx={{ lineHeight: 'normal' }}>
      {name}
      {isRecap && ' Recap'}
    </Typography>
  );
};
export default EventNameDisplay;
