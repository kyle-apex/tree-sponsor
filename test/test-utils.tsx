import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'utils/theme';
import { JSXElementConstructor, ReactElement } from 'react';

// Add in any providers here if necessary:
const Providers = ({ children }: { children: ReactElement<any, any> }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement<any, string | JSXElementConstructor<any>>, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
