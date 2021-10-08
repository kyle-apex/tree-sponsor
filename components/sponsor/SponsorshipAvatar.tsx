import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const SponsorshipAvatar = ({ image, name }: { image: string; name: string }) => {
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
      sx={{ backgroundColor: theme => theme.palette.primary.main, color: theme => theme.palette.primary.contrastText }}
    >
      {image ? <img src={image} width={40} height={40}></img> : <span>{abbreviation}</span>}
    </Avatar>
  );
};

export default SponsorshipAvatar;
