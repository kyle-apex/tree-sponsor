import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/system/Box';
import CircularProgress from '@mui/material/CircularProgress';

const UserAvatar = ({ image, name, size = 40, link }: { image: string; name: string; size?: number; link?: string }): JSX.Element => {
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

  return (
    <Avatar
      aria-label='recipe'
      sx={{
        backgroundColor: theme => theme.palette.primary.main,
        color: theme => theme.palette.primary.contrastText,
        width: size,
        height: size,
        fontSize: (size / 40) * 1.25 + 'rem',
        lineHeight: (size / 40) * 1.25,
        boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
        cursor: link ? 'pointer' : '',
      }}
      onClick={handleClick}
    >
      {!isNavigating ? (
        <Box sx={{ alignContent: 'center', display: 'flex' }}>
          {image ? <img src={image} width={size} height={size} /> : <span>{abbreviation}</span>}
        </Box>
      ) : (
        <CircularProgress size={size} color='inherit' />
      )}
    </Avatar>
  );
};

export default UserAvatar;
