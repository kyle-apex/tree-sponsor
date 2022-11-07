import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import SessionAvatar from 'components/SessionAvatar';
import NotificationIcon from 'components/notification/NotificationIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(0),
    color: theme.palette.primary.main,
  },
  title: {
    flexGrow: 1,
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    paddingLeft: theme.spacing(2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  loginButton: {},
}));

const Header = ({ title }: { title?: string }) => {
  const [session] = useSession();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));

  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const checkIsAdmin = async () => {
    const result = await axios.get('/api/me/is-admin');
    setIsAdmin(result.data);
  };

  useEffect(() => {
    checkIsAdmin();
  }, [session]);

  return (
    <>
      <AppBar position='static' color='inherit'>
        <Toolbar>
          <Link href='/'>
            <a>
              <Image src='/logo.png' alt='TreeFolks Young Professionals Logo' width={40} height={40} />
            </a>
          </Link>

          <Typography variant='h6' className={classes.title}>
            {title && <span>{title}</span>}
            {!title && (
              <>
                <span className={!session ? 'hidden-mobile' : ''}>Thank-a-Tree</span>
                <span className='hidden-mobile'> with TreeFolksYP</span>
              </>
            )}
          </Typography>

          {!session && (
            <Box sx={{ marginRight: 2, flexDirection: 'row', display: 'flex' }}>
              {!isMobile && (
                <Link href='/signup'>
                  <Button color='inherit'>Thank a Tree</Button>
                </Link>
              )}
              <Link href='/membership'>
                <Box sx={{ borderLeft: isMobile ? 'none' : 'solid 1px', borderColor: theme => theme.palette.secondary.main }}>
                  <Button color={isMobile ? 'inherit' : 'secondary'}>Become a Member</Button>
                </Box>
              </Link>
            </Box>
          )}

          {session && (
            <>
              <Link href='/account'>
                <Box mr={1} className='clickable'>
                  <SessionAvatar session={session} size={36} />
                </Box>
              </Link>
              <Box mr={1} className='clickable'>
                <NotificationIcon></NotificationIcon>
              </Box>
            </>
          )}

          <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={handleDrawerOpen} size='large'>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        anchor='right'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleDrawerClose}
      >
        <div className={classes.drawerHeader}>
          <Image src='/logo.png' alt='TreeFolks Young Professionals Logo' width={40} height={40} />
          <IconButton onClick={handleDrawerClose} size='large'>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {session && (
            <Link href='/account'>
              <ListItem button>
                <ListItemText primary='Account' />
              </ListItem>
            </Link>
          )}
          <Link href='/explore'>
            <ListItem button>
              <ListItemText primary='Tree Map' />
            </ListItem>
          </Link>
          {session && (
            <Link href='/profile'>
              <ListItem button>
                <ListItemText primary='Profile' />
              </ListItem>
            </Link>
          )}
          {session && isAdmin && (
            <Link href='/admin'>
              <ListItem button>
                <ListItemText primary='Admin' />
              </ListItem>
            </Link>
          )}
          {false && (
            <Link href='/about'>
              <ListItem button>
                <ListItemText primary='About' />
              </ListItem>
            </Link>
          )}
          <Link href='/contact'>
            <ListItem button>
              <ListItemText primary='Contact' />
            </ListItem>
          </Link>
          {session && (
            <ListItem button onClick={() => signOut({ callbackUrl: '/' })}>
              <ListItemText primary='Logout' />
            </ListItem>
          )}
        </List>
        <Divider />
        {!session && (
          <ListItem button>
            <Button
              sx={{ marginTop: 1 }}
              color='primary'
              fullWidth
              variant='contained'
              className={classes.loginButton}
              onClick={() => router.push('/signup')}
            >
              Thank a Tree
            </Button>
          </ListItem>
        )}
        <List>
          <ListItem button>
            {!session && (
              <Button
                color='secondary'
                variant='outlined'
                fullWidth
                className={classes.loginButton}
                onClick={() => signIn('', { callbackUrl: '/account' })}
              >
                Login
              </Button>
            )}
            {session && (
              <Button
                color='secondary'
                variant='outlined'
                fullWidth
                className={classes.loginButton}
                onClick={() => router.push('/account')}
              >
                Account
              </Button>
            )}
          </ListItem>
          {session && (
            <ListItem button>
              <Button
                sx={{ marginTop: 1 }}
                color='primary'
                fullWidth
                variant='contained'
                className={classes.loginButton}
                onClick={() => router.push('/signup')}
              >
                Thank More Trees
              </Button>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};
export default Header;
