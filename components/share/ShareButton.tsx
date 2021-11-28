import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PartialSponsorship, PartialUser } from 'interfaces';
import React, { useState } from 'react';
import ShareMenu from './ShareMenu';

const ShareButton = ({ sponsorship, user }: { sponsorship?: PartialSponsorship; user?: PartialUser }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    setMenuAnchorEl(event.currentTarget);
  };
  return (
    <>
      <Tooltip title='Share'>
        <IconButton onClick={handleClick}>
          <ShareIcon></ShareIcon>
        </IconButton>
      </Tooltip>
      <ShareMenu sponsorship={sponsorship} user={user} anchorEl={menuAnchorEl} setAnchorEl={setMenuAnchorEl}></ShareMenu>
    </>
  );
};
export default ShareButton;
