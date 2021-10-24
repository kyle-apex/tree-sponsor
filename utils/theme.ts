import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#486e62',
    },
    secondary: {
      main: '#6e4854',
    },
  },
  typography: {
    h1: {
      fontSize: '2.4rem',
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '1.8rem',
      marginBottom: '1rem',
    },
    subtitle1: {
      fontSize: '1.2rem',
    },
  },
});

export default theme;
