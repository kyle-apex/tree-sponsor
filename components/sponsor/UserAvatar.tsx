import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/system/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/material/styles';

const UserAvatar = ({
  image,
  name,
  size = 40,
  link,
  sx,
  'data-testid': dataTestId,
  colorIndex,
}: {
  image?: string;
  name: string;
  size?: number;
  link?: string;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
  colorIndex?: number;
}): JSX.Element => {
  const [abbreviation, setAbbreviation] = useState('AN');
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const getAbbreviation = (name: string): string => {
    if (name) {
      const nameSplit = name.split(' ');
      if (nameSplit.length == 1) return nameSplit[0].charAt(0).toUpperCase();
      else return nameSplit[0].charAt(0).toUpperCase() + nameSplit[nameSplit.length - 1].charAt(0).toUpperCase();
    } else {
      return 'AN';
    }
  };

  const handleClick = () => {
    console.log('link', link);
    if (link) {
      router.push(link);
      setIsNavigating(true);
    }
  };

  useEffect(() => {
    setAbbreviation(getAbbreviation(name));
  }, [name]);

  // Get a consistent color index based on the user's name or use provided colorIndex
  const getAvatarColorIndex = (): number => {
    // If colorIndex is provided, use it
    if (colorIndex !== undefined) {
      return colorIndex % 5;
    }

    // Otherwise, use hash-based approach
    // Simple hash function to convert name to a number
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use modulo to get an index between 0 and 5
    return Math.abs(hash % 5);
  };

  return (
    <Avatar
      aria-label='recipe'
      data-testid={dataTestId}
      sx={{
        backgroundColor: theme => {
          const colorIndex = getAvatarColorIndex();
          // Create 5 variations using theme colors
          switch (colorIndex) {
            case 0:
              return theme.palette.primary.main;
            case 1:
              return theme.palette.secondary.light;
            case 2:
              return theme.palette.secondary.main;
            case 3:
              return theme.palette.primary.dark;
            case 4:
              return theme.palette.primary.light;
            default:
              return theme.palette.primary.main;
          }
        },
        color: theme => theme.palette.primary.contrastText,
        width: size,
        height: size,
        fontSize: (size / 40) * 1.25 + 'rem',
        lineHeight: (size / 40) * 1.25,
        boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
        cursor: link ? 'pointer' : '',
        ...sx,
      }}
      onClick={handleClick}
    >
      {!isNavigating ? (
        <Box sx={{ alignContent: 'center', display: 'flex' }}>
          {image ? (
            <img alt='User Avatar' src={image} width={size} height={size} referrerPolicy='no-referrer' />
          ) : (
            <span>{abbreviation}</span>
          )}
        </Box>
      ) : (
        <CircularProgress size={size} color='inherit' />
      )}
    </Avatar>
  );
};

export default UserAvatar;
