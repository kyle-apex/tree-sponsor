import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Button, IconButton, Toolbar, Typography, AppBar, Drawer, Divider, List, ListItem, ListItemText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
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

const Header = () => {
  const [session, loading] = useSession();
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
            <span className={!session ? 'hidden-mobile' : ''}>TreeFolksYP</span>
          </Typography>

          {!session && (
            <Link href='/signup'>
              <Button sx={{ marginRight: 2 }} color='inherit'>
                Sponsor a tree
              </Button>
            </Link>
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
          <Link href='/explore'>
            <ListItem button>
              <ListItemText primary='Tree Map' />
            </ListItem>
          </Link>
          {session && (
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
              Sponsor a Tree
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
                Sponsor More Trees
              </Button>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};
export default Header;
