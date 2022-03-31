import { createTheme } from '@mui/material/styles';
import { TMUIRichTextEditorStyles } from 'mui-rte';

const muiRteTheme: TMUIRichTextEditorStyles = {
  overrides: {
    MUIRichTextEditor: {
      placeHolder: {
        position: 'static',
        paddingLeft: 14,
        paddingTop: 0,
        color: 'var(--label-color)',
      },
      editor: {
        padding: '8.5px 14px',
        paddingTop: 0,
      } /*
      container: {
        display: 'flex',
        flexDirection: 'column-reverse',
      },
      editor: {
        backgroundColor: '#ebebeb',
        padding: '20px',
        height: '200px',
        maxHeight: '200px',
        overflow: 'auto',
      },
      toolbar: {
        borderTop: '1px solid gray',
        backgroundColor: '#ebebeb',
      },
      placeHolder: {
        backgroundColor: '#ebebeb',
        paddingLeft: 20,
        width: 'inherit',
      },
      anchorLink: {
        color: '#333333',
        textDecoration: 'underline',
      },*/,
    },
  },
};

const theme = createTheme({
  ...muiRteTheme,
  palette: {
    primary: {
      main: '#486e62',
    },
    secondary: {
      main: '#6e4854',
    },
    info: {
      main: 'rgb(113, 153, 140)',
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
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
  },
});

export default theme;
