import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import RestrictSection from 'components/RestrictSection';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';

const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls={open ? 'dashboard-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant='outlined'
        sx={{ height: 'fit-content', alignSelf: 'center' }}
      >
        Admin Pages <ChevronDownIcon sx={{ ml: 0.5 }}></ChevronDownIcon>
      </Button>
      <Menu
        id='dashboard-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigateTo('/admin/membership-dashboard')}>Membership Dashboard</MenuItem>
        <MenuItem onClick={() => navigateTo('/admin/fundraising-dashboard')}>Fundraising Dashboard</MenuItem>
        <MenuItem onClick={() => navigateTo('/admin/event-dashboard')}>Event Dashboard</MenuItem>
        <RestrictSection accessType='hasEventManagement'>
          <MenuItem onClick={() => navigateTo('/admin/events')}>Manage Events</MenuItem>
        </RestrictSection>
        <RestrictSection accessType='hasEventManagement'>
          <MenuItem onClick={() => navigateTo('/admin/events/checkins')}>Manage Event Checkins</MenuItem>
        </RestrictSection>
        <MenuItem onClick={() => navigateTo('/admin/events/rsvp-analytics')}>View Event Invites</MenuItem>
        <RestrictSection accessType='hasRedirectManagement'>
          <MenuItem onClick={() => navigateTo('/admin/redirects')}>Manage Redirects</MenuItem>
        </RestrictSection>
        <RestrictSection accessType='isTreeReviewer'>
          <MenuItem onClick={() => navigateTo('/admin/review/trees')}>Manage Trees</MenuItem>
        </RestrictSection>
        <RestrictSection accessType='hasAuthManagement'>
          <MenuItem onClick={() => navigateTo('/admin/roles')}>Manage Roles</MenuItem>
        </RestrictSection>

        <RestrictSection accessType='hasFormManagement'>
          <MenuItem onClick={() => navigateTo('/admin/forms')}>Manage Forms</MenuItem>
        </RestrictSection>
        <RestrictSection accessType='hasShirtManagement'>
          <MenuItem onClick={() => navigateTo('/account/shirts')}>Manage Shirts</MenuItem>
        </RestrictSection>
      </Menu>
    </>
  );
};

export default NavigationMenu;
