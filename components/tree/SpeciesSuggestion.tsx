import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { PartialSpeciesSuggestion } from 'interfaces';

const SpeciesSuggestion = ({
  suggestion,
  onClick,
  isSelected,
}: {
  suggestion: PartialSpeciesSuggestion;
  onClick?: (speciesId: number) => void;
  isSelected?: boolean;
}) => {
  const probabilityString = Math.ceil(suggestion.probability * 100) + '%';
  return (
    <ListItemButton
      onClick={() => {
        if (onClick) onClick(suggestion.speciesId);
      }}
      selected={isSelected}
    >
      <ListItemAvatar>
        {suggestion?.similarImages?.map(image => {
          return (
            <img
              style={{ marginRight: '5px', marginTop: '6px', marginBottom: '6px' }}
              width='60px'
              height='60px'
              src={image}
              key={image}
              alt='Species Image'
            />
          );
        })}
      </ListItemAvatar>
      <ListItemText
        sx={{ marginLeft: '5px' }}
        primary={
          <Typography component='span' variant='body1' sx={{ lineHeight: 1 }}>
            {suggestion.name}
          </Typography>
        }
        secondary={
          <>
            {suggestion.genus && (
              <Typography component='div' variant='body2' sx={{ fontStyle: 'italic', marginTop: '-2px' }}>
                {suggestion.genus.substring(0, 1).toUpperCase() + suggestion.genus.substring(1, suggestion.genus.length)}{' '}
                {suggestion.species}
              </Typography>
            )}
            <Typography component='div' variant='body2'>
              {probabilityString} Match
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
};
export default SpeciesSuggestion;
