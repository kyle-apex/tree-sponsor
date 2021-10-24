import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'utils/theme';
import { ReactElement } from 'react';

// Add in any providers here if necessary:
const Providers = ({ children }: { children: ReactElement }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement, options = {}) => render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
