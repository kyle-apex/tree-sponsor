import React, { useState } from 'react';
import { PartialSponsorship } from 'interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import CopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import { getDisplayTitle } from 'utils/sponsorship/get-display-title';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ShareMenu = ({
  sponsorship,
  anchorEl,
  setAnchorEl,
}: {
  sponsorship: PartialSponsorship;
  anchorEl: null | Element | ((element: Element) => Element);
  setAnchorEl: (el: Element) => void;
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const open = Boolean(anchorEl);
  const router = useRouter();
  const path = '/u/' + sponsorship.user?.profilePath + '/?t=' + sponsorship.id;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + path);
    setSnackbarOpen(true);
    handleClose();
  };

  const shareToFacebook = () => {
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + path)}`;
    shareLink(facebookLink);
  };

  const shareToTwitter = () => {
    const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      getDisplayTitle(sponsorship) + ' | Thank-a-Tree with TreeFolksYP',
    )}&url=${encodeURIComponent(window.location.origin + path)}`;
    shareLink(link);
  };

  const shareToLinkedIn = () => {
    const link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + path)}`;
    shareLink(link);
  };

  const shareToSnapchat = () => {
    const link = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(window.location.origin + path)}`;
    shareLink(link);
  };

  const shareLink = (link: string) => {
    window.open(link, 'tfyp-share-dialog', 'width=626,height=536');
    handleClose();
  };

  return (
    <>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '.MuiMenu-list': { paddingTop: 0, paddingBottom: 0, backgroundColor: theme => theme.palette.secondary.main, color: 'white' },
        }}
      >
        <MenuItem onClick={copyLink} sx={{ justifyContent: 'space-between' }}>
          Copy Link <CopyIcon sx={{ fontSize: '20px' }}></CopyIcon>
        </MenuItem>
        <MenuItem onClick={shareToFacebook}>Share to Facebook</MenuItem>
        <MenuItem onClick={shareToLinkedIn}>Share to LinkedIn</MenuItem>
        <MenuItem onClick={shareToTwitter}>Share to Twitter</MenuItem>
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity='success' color='info' sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};
export default ShareMenu;
