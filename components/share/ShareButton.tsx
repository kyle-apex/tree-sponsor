import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import { PartialSponsorship } from 'interfaces';
import React, { useState } from 'react';
import ShareMenu from './ShareMenu';

const ShareButton = ({ sponsorship }: { sponsorship?: PartialSponsorship }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    setMenuAnchorEl(event.currentTarget);
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <ShareIcon></ShareIcon>
      </IconButton>
      <ShareMenu sponsorship={sponsorship} anchorEl={menuAnchorEl} setAnchorEl={setMenuAnchorEl}></ShareMenu>
    </>
  );
};
export default ShareButton;
