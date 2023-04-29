import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';
const repeatAr = [1, 2, 3];
const SuggestSpeciesLoading = () => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up(400));
  const padding = isMobile ? 0 : 1;
  return (
    <>
      {repeatAr.map(idx => (
        <ListItem key={idx} sx={{ paddingLeft: padding, paddingRight: padding }}>
          <ListItemAvatar sx={{ display: 'flex' }}>
            <Skeleton variant='rectangular' sx={{ width: '60px', marginRight: '5px', marginTop: '6px', marginBottom: '6px' }} height={60} />
            {!isMobile && (
              <Skeleton
                variant='rectangular'
                sx={{ width: '60px', marginRight: '5px', marginTop: '6px', marginBottom: '6px' }}
                height={60}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            sx={{ marginLeft: '5px' }}
            primary={<Skeleton variant='text' sx={{ width: '90%' }} />}
            secondary={
              <>
                <Skeleton variant='text' sx={{ width: '75%' }} />
                <Skeleton variant='text' sx={{ width: '60%' }} />
              </>
            }
          />
        </ListItem>
      ))}
    </>
  );
};
export default SuggestSpeciesLoading;
