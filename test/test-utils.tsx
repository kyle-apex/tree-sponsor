import { render } from '@testing-library/react';
import theme from 'utils/theme';
import React, { ReactElement } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Session } from 'interfaces';
const queryClient = new QueryClient();
jest.mock('next-auth/client');
import client from 'next-auth/client';

(client.useSession as jest.Mock).mockReturnValue([{}, false]);

// Add in any providers here if necessary:
const Providers = ({ children }: { children: ReactElement }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options = {}) => render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

export const mockSession = (session: Session) => {
  (client.useSession as jest.Mock).mockReturnValueOnce([session, false]);
};
