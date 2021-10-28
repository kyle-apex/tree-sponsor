import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react';

const SponsorshipAvatar = ({ image, name, size = 40 }: { image: string; name: string; size?: number }): JSX.Element => {
  const [abbreviation, setAbbreviation] = useState('AN');

  const getAbbreviation = (name: string): string => {
    if (name) {
      const nameSplit = name.split(' ');
      if (nameSplit.length == 1) return nameSplit[0].charAt(0).toUpperCase();
      else return nameSplit[0].charAt(0).toUpperCase() + nameSplit[nameSplit.length - 1].charAt(0).toUpperCase();
    } else {
      return 'AN';
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
        boxShadow: 'inset 0 0px 0px 1px hsl(0deg 0% 0% / 20%), 0px 0px 2px grey',
      }}
    >
      {image ? <img src={image} width={size} height={size} /> : <span>{abbreviation}</span>}
    </Avatar>
  );
};

export default SponsorshipAvatar;
