import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  AppBar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Image from 'next/image';

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
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
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
            TreeFolksYP
          </Typography>

          {!session && (
            <>
              <Button color='inherit' onClick={() => signIn()}>
                Become a Member
              </Button>
            </>
          )}

          <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={handleDrawerOpen}>
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
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {session && (
            <Link href='admin'>
              <ListItem button>
                <ListItemText primary='Admin' />
              </ListItem>
            </Link>
          )}
          <Link href='about'>
            <ListItem button>
              <ListItemText primary='About' />
            </ListItem>
          </Link>
          {session && (
            <ListItem button onClick={() => signOut()}>
              <ListItemText primary='Logout' />
            </ListItem>
          )}
        </List>
        <Divider />
        <List>
          <ListItem button>
            {!session && (
              <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => signIn()}>
                Login
              </Button>
            )}
            {session && (
              <Button color='secondary' variant='outlined' fullWidth className={classes.loginButton} onClick={() => signIn()}>
                Account
              </Button>
            )}
          </ListItem>
        </List>
        {!session && (
          <ListItem button>
            <Button color='primary' fullWidth variant='contained' className={classes.loginButton} onClick={() => signIn()}>
              Become a Member
            </Button>
          </ListItem>
        )}
      </Drawer>
    </>
  );
};
export default Header;
