import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomePage from './welcome';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { PartialEvent, PartialUser } from 'interfaces';
import { useRouter } from 'next/router';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { path: 'test-event' },
  }),
}));

// Create a basic theme for testing
const theme = createTheme();

const customRender = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('WelcomePage', () => {
  const mockEvent = {
    id: 1,
    name: 'Test Event',
    path: 'test',
    startDate: new Date(),
    endDate: new Date(),
  };

  const mockAttendees: PartialUser[] = [
    {
      id: 1,
      name: 'Exec Member',
      displayName: 'Exec Member',
      roles: [{ id: 1, name: 'Exec Team', isAdmin: true }],
    },
    {
      id: 2,
      name: 'Core Member',
      displayName: 'Core Member',
      roles: [{ id: 2, name: 'Core Team', isAdmin: false }],
    },
    {
      id: 3,
      name: 'New Person',
      displayName: 'New Person',
      roles: [],
      subscriptions: [{ id: 1, createdDate: new Date(), lastPaymentDate: new Date() }],
    },
    {
      id: 4,
      name: 'Existing Supporter',
      displayName: 'Existing Supporter',
      subscriptions: [{ id: 2, createdDate: new Date(), lastPaymentDate: new Date() }],
      roles: [],
    },
    {
      id: 5,
      name: 'Friend',
      displayName: 'Friend',
      roles: [],
    },
  ];

  const newAttendee: PartialUser = {
    id: 6, // New unique ID
    name: 'New Person',
    displayName: 'New Person',
    roles: [],
    subscriptions: [{ id: 3, createdDate: new Date(), lastPaymentDate: new Date() }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders loading state initially', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    customRender(<WelcomePage event={mockEvent} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays attendees grouped by role', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('quiz-stats')) {
        return Promise.resolve({ data: { correctResponsesCount: 0 } });
      }
      return Promise.resolve({
        data: {
          attendees: [
            {
              id: 1,
              name: 'Exec Member',
              displayName: 'Exec Member',
              roles: [{ name: 'Exec Team' }],
            },
            {
              id: 2,
              name: 'Core Member',
              displayName: 'Core Member',
              roles: [{ name: 'Core Team' }],
            },
            {
              id: 3,
              name: 'New Person',
              displayName: 'New Person',
              roles: [],
              subscriptions: [{ createdDate: new Date().toISOString() }],
            },
            {
              id: 4,
              name: 'Existing Supporter',
              displayName: 'Existing Supporter',
              subscriptions: [{ lastPaymentDate: new Date().toISOString() }],
              roles: [],
            },
            {
              id: 5,
              name: 'Friend',
              displayName: 'Friend',
              roles: [],
            },
          ],
        },
      });
    });

    await act(async () => {
      customRender(<WelcomePage event={mockEvent} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Who's Here")).toBeInTheDocument();
    });

    expect(screen.getByText('1 Friend and Ally')).toBeInTheDocument();
    expect(screen.getByText('1 New Supporting Member')).toBeInTheDocument();
    expect(screen.getByText('1 Core Team')).toBeInTheDocument();
    expect(screen.getByText('1 Exec Team')).toBeInTheDocument();
  });

  it('shows welcome message for new check-ins', async () => {
    // Mock initial API call to return empty list
    mockedAxios.get.mockImplementationOnce((url: string) =>
      Promise.resolve({
        data: {
          attendees: [
            {
              id: 1,
              name: 'Exec Member',
              displayName: 'Exec Member',
              roles: [{ name: 'Exec Team' }],
            },
            {
              id: 2,
              name: 'Core Member',
              displayName: 'Core Member',
              roles: [{ name: 'Core Team' }],
            },
            {
              id: 3,
              name: 'New Person',
              displayName: 'New Person',
              roles: [],
              subscriptions: [{ createdDate: new Date().toISOString() }],
            },
            {
              id: 4,
              name: 'Existing Supporter',
              displayName: 'Existing Supporter',
              subscriptions: [{ lastPaymentDate: new Date().toISOString() }],
              roles: [],
            },
            {
              id: 5,
              name: 'Friend',
              displayName: 'Friend',
              roles: [],
            },
          ],
        },
      }),
    );

    // Mock quiz stats endpoint
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('quiz-stats')) {
        return Promise.resolve({ data: { correctResponsesCount: 0 } });
      }
      // Second API call returns list with new attendee
      return Promise.resolve({
        data: {
          attendees: [
            {
              id: 1,
              name: 'Exec Member',
              displayName: 'Exec Member',
              roles: [{ name: 'Exec Team' }],
            },
            {
              id: 2,
              name: 'Core Member',
              displayName: 'Core Member',
              roles: [{ name: 'Core Team' }],
            },
            {
              id: 3,
              name: 'New Person',
              displayName: 'New Person',
              roles: [],
              subscriptions: [{ createdDate: new Date().toISOString() }],
            },
            {
              id: 4,
              name: 'Existing Supporter',
              displayName: 'Existing Supporter',
              subscriptions: [{ lastPaymentDate: new Date().toISOString() }],
              roles: [],
            },
            {
              id: 5,
              name: 'Friend',
              displayName: 'Friend',
              roles: [],
            },
            {
              id: 6,
              name: 'New Person',
              displayName: 'New Person',
              roles: [],
              subscriptions: [{ createdDate: new Date().toISOString() }],
            },
          ],
        },
      });
    });

    render(<WelcomePage event={mockEvent} />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Advance timers to trigger polling
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Wait for welcome message
    await waitFor(() => {
      const welcomeMessage = screen.getByText((content, element) => {
        return element?.textContent === 'Welcome New Person';
      });
      expect(welcomeMessage).toBeInTheDocument();
    });

    // Advance timers to clear welcome message
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verify welcome message is removed
    await waitFor(() => {
      const welcomeMessage = screen.queryByText((content, element) => {
        return element?.textContent === 'Welcome New Person';
      });
      expect(welcomeMessage).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    customRender(<WelcomePage event={mockEvent} />);

    await waitFor(() => {
      expect(screen.getByText('No check-ins yet')).toBeInTheDocument();
    });
  });

  it('cleans up intervals on unmount', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('quiz-stats')) {
        return Promise.resolve({ data: { correctResponsesCount: 0 } });
      }
      return Promise.resolve({ data: { attendees: [] } });
    });

    const { unmount } = customRender(<WelcomePage event={mockEvent} />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Unmount component
    unmount();

    // Advance timers to ensure no errors from unmounted intervals
    act(() => {
      jest.advanceTimersByTime(10000);
    });
  });
});
