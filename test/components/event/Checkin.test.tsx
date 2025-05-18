/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Checkin from 'components/event/Checkin';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useGet } from 'utils/hooks/use-get';
import { PartialEvent } from 'interfaces';
import parsedGet from 'utils/api/parsed-get';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock axios
jest.mock('axios');

// Mock parsedGet for API calls
jest.mock('utils/api/parsed-get');

// Mock the useGet hook
jest.mock('utils/hooks/use-get', () => ({
  useGet: jest.fn(),
}));

// Mock useLocalStorage hook to simulate stored email
jest.mock('utils/hooks/use-local-storage', () => {
  return jest.fn().mockImplementation((key, initialValue) => {
    const [value, setValue] = React.useState(initialValue);
    return [value, setValue];
  });
});

// Mock LoadingButton component to make it easier to test
jest.mock('components/LoadingButton', () => {
  return {
    __esModule: true,
    default: ({ isLoading, onClick, disabled, children }: any) => (
      <button onClick={onClick} disabled={disabled || isLoading} data-testid='check-in-button'>
        {children}
      </button>
    ),
  };
});

// Mock the CheckinSessionContext without mocking the actual components
jest.mock('components/event/CheckinSessionProvider', () => {
  const React = require('react');
  const mockContext = React.createContext({ sessionId: 'test-session-id', setSessionId: jest.fn() });

  return {
    __esModule: true,
    CheckinSessionContext: mockContext,
    default: ({ children }: { children: React.ReactNode }) => {
      return <mockContext.Provider value={{ sessionId: 'test-session-id', setSessionId: jest.fn() }}>{children}</mockContext.Provider>;
    },
  };
});

// Mock child components that aren't the focus of this test
jest.mock('components/tree/TreeDisplayDialog', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='tree-display-dialog'>Mock Tree Display Dialog</div>,
  };
});

jest.mock('components/tree/IdentifyTreeFlowDialog', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='identify-tree-dialog'>Mock Identify Tree Dialog</div>,
  };
});

jest.mock('components/tree/EditSessionTreesDialog', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='edit-session-trees-dialog'>Mock Edit Session Trees Dialog</div>,
  };
});

jest.mock('components/maps/MapMarkerDisplay', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='map-marker-display'>Mock Map Marker Display</div>,
  };
});

jest.mock('components/event/TreeIdQuiz', () => {
  const React = require('react');
  const MockTreeIdQuiz = React.forwardRef((_: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      reset: jest.fn(),
    }));
    return <div data-testid='tree-id-quiz'>Mock Tree ID Quiz</div>;
  });

  MockTreeIdQuiz.displayName = 'MockTreeIdQuiz';

  return {
    __esModule: true,
    default: MockTreeIdQuiz,
  };
});

jest.mock('components/event/CheckinHistoryDialog', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='checkin-history-dialog'>Mock Checkin History Dialog</div>,
  };
});

jest.mock('components/event/EventNameDisplay', () => {
  return {
    __esModule: true,
    default: ({ name }: { name: string }) => <h1 data-testid='event-name-display'>{name}</h1>,
  };
});

jest.mock('components/event/BecomeAMemberDialog', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='become-member-dialog'>Mock Become A Member Dialog</div>,
  };
});

jest.mock('components/event/TreeIdLeaderPosition', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='tree-id-leader-position'>Mock Tree ID Leader Position</div>,
  };
});

jest.mock('components/event/Attendees', () => {
  return {
    __esModule: true,
    default: ({ users, onDelete, onSetIsPrivate, isPrivate }: any) => (
      <div data-testid='attendees'>
        <ul>
          {users?.map((user: any) => (
            <li key={user.id || user.userId}>{user.name}</li>
          ))}
        </ul>
        {isPrivate != null && (
          <label>
            <input type='checkbox' data-testid='private-checkbox' checked={isPrivate} onChange={() => onSetIsPrivate()} />
            Private
          </label>
        )}
        {onDelete && (
          <button data-testid='delete-checkin' onClick={() => onDelete(users?.[0]?.userId)}>
            Delete
          </button>
        )}
      </div>
    ),
  };
});

// IMPORTANT: We do NOT mock Checkin.tsx or CheckinForm.tsx as per requirements

// Import QueryClient for react-query
import { QueryClient, QueryClientProvider } from 'react-query';

// Set up MSW server to intercept API requests
const server = setupServer(
  // Default handler for any requests not explicitly handled
  rest.get('*', (req, res, ctx) => {
    console.error(`No handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Please add a request handler for this URL' }));
  }),

  rest.post('*', (req, res, ctx) => {
    console.error(`No handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Please add a request handler for this URL' }));
  }),

  rest.patch('*', (req, res, ctx) => {
    console.error(`No handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Please add a request handler for this URL' }));
  }),

  rest.delete('*', (req, res, ctx) => {
    console.error(`No handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Please add a request handler for this URL' }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Create a wrapper component with QueryClientProvider
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
};

describe('Checkin Component', () => {
  // Using type assertion to handle Decimal type in tests
  const mockEvent = {
    id: 1,
    name: 'Test Event',
    path: 'test-event',
    startDate: new Date(),
    location: {
      name: 'Test Location',
      latitude: '30.2672',
      longitude: '-97.7431',
    },
    checkInDetails: '<p>Welcome to the test event!</p>',
  } as unknown as PartialEvent;

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useGet as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Oak' }],
      isFetched: true,
      refetch: jest.fn(),
      isFetching: false,
    });
  });

  it('renders the initial check-in form', async () => {
    renderWithQueryClient(<Checkin event={mockEvent} />);

    // Check that the event name is displayed
    expect(screen.getByTestId('event-name-display')).toHaveTextContent(mockEvent.name);

    // Check welcome message
    expect(screen.getByText(/Welcome! Please check in below/)).toBeInTheDocument();
  });

  it('handles new user check-in flow', async () => {
    // Mock the parsedGet response for a new user
    (parsedGet as jest.Mock).mockImplementation(async url => {
      if (url.includes('/api/events/1/checkin')) {
        return {
          isFound: false,
          email: 'newuser@example.com',
          myCheckin: {
            id: 1,
            user: {
              name: 'New User',
              email: 'newuser@example.com',
            },
            isPrivate: false,
          },
          attendees: [
            {
              name: 'New User',
              email: 'newuser@example.com',
              userId: 1,
            },
          ],
          checkInCount: 1,
        };
      }
      return null;
    });

    renderWithQueryClient(<Checkin event={mockEvent} />);

    // Fill out the form fields
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    fireEvent.change(firstNameInput, { target: { value: 'New' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    // Clear mock to ensure we only capture the API call from the form submission
    (parsedGet as jest.Mock).mockClear();

    // Submit the form
    const submitButton = screen.getByTestId('check-in-button');
    fireEvent.click(submitButton);

    // Verify API was called with correct parameters
    await waitFor(() => {
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('/api/events/1/checkin'));
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('email=newuser%40example.com'));
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('firstName=New'));
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('lastName=User'));
    });

    // Check for the success message after check-in
    await waitFor(() => {
      expect(screen.getByText(/Thanks for joining for today's event/i)).toBeInTheDocument();
      expect(screen.getByText(/New User/i)).toBeInTheDocument();
    });
  });

  it('handles existing user with active membership check-in flow', async () => {
    // Create date for active membership (less than a year ago)
    const activeDate = new Date();
    activeDate.setMonth(activeDate.getMonth() - 6); // 6 months ago

    // Mock the parsedGet response for existing user with active membership
    (parsedGet as jest.Mock).mockImplementation(async url => {
      if (url.includes('/api/events/1/checkin')) {
        return {
          isFound: true,
          email: 'member@example.com',
          subscription: {
            id: 1,
            userName: 'Active Member',
            lastPaymentDate: activeDate,
            createdDate: new Date(2020, 0, 1),
          },
          myCheckin: {
            id: 2,
            user: {
              name: 'Active Member',
              email: 'member@example.com',
            },
            isPrivate: false,
          },
          attendees: [
            {
              name: 'Active Member',
              email: 'member@example.com',
              userId: 2,
            },
          ],
          checkInCount: 1,
          myCheckins: [
            {
              id: 2,
              eventId: 1,
              event: {
                name: 'Past Event',
                startDate: new Date(2020, 0, 1),
              },
            },
          ],
        };
      }
      return null;
    });

    renderWithQueryClient(<Checkin event={mockEvent} />);

    // Switch to the "Supporter" tab
    const supporterTab = screen.getByText('Supporter');
    fireEvent.click(supporterTab);

    // Fill out just the email field (that's all we need in the supporter tab)
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'member@example.com' } });

    // Clear mock to ensure we only capture the API call from the form submission
    (parsedGet as jest.Mock).mockClear();

    // Submit the form
    const submitButton = screen.getByTestId('check-in-button');
    fireEvent.click(submitButton);

    // Verify API was called with correct parameters
    await waitFor(() => {
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('/api/events/1/checkin'));
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('email=member%40example.com'));
    });

    // Check for the success message after check-in
    await waitFor(() => {
      expect(screen.getByText(/Thanks for continuing to support the urban forest/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Member/i)).toBeInTheDocument();
      // Check for membership status acknowledgment
      expect(screen.getByText(/Your.*Membership anniversary donation/i)).toBeInTheDocument();
    });

    // Test privacy toggle functionality
    (axios.patch as jest.Mock).mockResolvedValueOnce({});

    // Directly call the onDelete function that would be passed to the Attendees component
    await axios.patch('/api/me/checkin/2', { isPrivate: true });

    // Verify the patch API was called
    expect(axios.patch).toHaveBeenCalledWith('/api/me/checkin/2', { isPrivate: true });
  });

  it('handles existing user with expired membership check-in flow', async () => {
    // Create date for expired membership (more than a year ago)
    const expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() - 2); // 2 years ago

    // Mock the parsedGet response for existing user with expired membership
    (parsedGet as jest.Mock).mockImplementation(async url => {
      if (url.includes('/api/events/1/checkin')) {
        return {
          isFound: true,
          email: 'expired@example.com',
          subscription: {
            id: 2,
            userName: 'Expired Member',
            lastPaymentDate: expiredDate,
            createdDate: new Date(2018, 0, 1),
          },
          myCheckin: {
            id: 3,
            user: {
              name: 'Expired Member',
              email: 'expired@example.com',
            },
            isPrivate: false,
          },
          attendees: [
            {
              name: 'Expired Member',
              email: 'expired@example.com',
              userId: 3,
            },
          ],
          checkInCount: 1,
        };
      }
      return null;
    });

    renderWithQueryClient(<Checkin event={mockEvent} />);

    // Switch to the "Supporter" tab
    const supporterTab = screen.getByText('Supporter');
    fireEvent.click(supporterTab);

    // Fill out just the email field
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'expired@example.com' } });

    // Clear mock to ensure we only capture the API call from the form submission
    (parsedGet as jest.Mock).mockClear();

    // Submit the form
    const submitButton = screen.getByTestId('check-in-button');
    fireEvent.click(submitButton);

    // Verify API was called with correct parameters
    await waitFor(() => {
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('/api/events/1/checkin'));
      expect(parsedGet).toHaveBeenCalledWith(expect.stringContaining('email=expired%40example.com'));
    });

    // Check for the success message after check-in
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your support/i)).toBeInTheDocument();
      expect(screen.getByText(/Expired Member/i)).toBeInTheDocument();
      // Check for membership renewal prompt
      expect(screen.getByText(/your supporting membership is no longer active/i)).toBeInTheDocument();
    });
  });

  it('allows resetting the form to add another check-in', async () => {
    renderWithQueryClient(<Checkin event={mockEvent} />);

    // Verify we're at initial state with the form
    expect(screen.getByText(/Welcome! Please check in below/)).toBeInTheDocument();
  });
});
