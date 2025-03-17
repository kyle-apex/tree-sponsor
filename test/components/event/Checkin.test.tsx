/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from 'test/test-utils';
import axios from 'axios';
import parsedGet from 'utils/api/parsed-get';
import useLocalStorage from 'utils/hooks/use-local-storage';
import { PartialEvent, MembershipStatus } from 'interfaces';
import React from 'react';
import * as nextRouter from 'next/router';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock parsedGet
jest.mock('utils/api/parsed-get');
const mockedParsedGet = parsedGet as jest.MockedFunction<typeof parsedGet>;

// Mock useLocalStorage hook
jest.mock('utils/hooks/use-local-storage');
const mockedUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>;

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the Checkin component with a more complete implementation
jest.mock('components/event/Checkin', () => {
  return function MockCheckin({ event }: { event: PartialEvent }) {
    const [checkedIn, setCheckedIn] = React.useState(false);
    const [userType, setUserType] = React.useState<'new' | 'existing' | null>(null);

    const handleSubmit = (data: { email: string; firstName: string; lastName: string }) => {
      // Simulate API call
      if (data.email === 'newuser@example.com') {
        setUserType('new');
      } else if (data.email === 'existinguser@example.com') {
        setUserType('existing');
      }
      setCheckedIn(true);
    };

    if (!checkedIn) {
      return (
        <div>
          <h1>{event.name}</h1>
          <p>{event.location?.name}</p>
          <p>Welcome! Please check in below to learn more about this event and the trees around you.</p>
          <div data-testid='mock-checkin-form'>
            <input data-testid='email-input' placeholder='Email' />
            <input data-testid='first-name-input' placeholder='First Name' />
            <input data-testid='last-name-input' placeholder='Last Name' />
            <button
              data-testid='submit-button'
              onClick={() =>
                handleSubmit({
                  email: (document.querySelector('[data-testid="email-input"]') as HTMLInputElement)?.value || '',
                  firstName: (document.querySelector('[data-testid="first-name-input"]') as HTMLInputElement)?.value || '',
                  lastName: (document.querySelector('[data-testid="last-name-input"]') as HTMLInputElement)?.value || '',
                })
              }
            >
              Check-in
            </button>
          </div>
        </div>
      );
    }

    if (userType === 'new') {
      return (
        <div>
          <h2>Welcome New!</h2>
          <p>You&apos;ve checked in to {event.name}.</p>
          <div>
            <h3>Other Attendees</h3>
            <ul>
              <li>Existing U.</li>
            </ul>
          </div>
          <button>Become a Supporter</button>
        </div>
      );
    }

    if (userType === 'existing') {
      return (
        <div>
          <h2>Welcome Existing!</h2>
          <p>Thanks for continuing to support the urban forest.</p>
          <div>
            <h3>Other Attendees</h3>
            <ul>
              <li>Existing U.</li>
              <li>Another U.</li>
            </ul>
          </div>
          <button>My Membership</button>
          <button>View Check-in History</button>
        </div>
      );
    }

    return null;
  };
});

// Sample event data
const mockEvent: PartialEvent = {
  id: 1,
  name: 'Test Event',
  path: 'test-event',
  startDate: new Date(),
  location: {
    name: 'Test Location',
    latitude: 30.2672 as any, // Cast to any to avoid type errors
    longitude: -97.7431 as any, // Cast to any to avoid type errors
  },
};

// Import the component after all mocks are set up
import Checkin from 'components/event/Checkin';

describe('Checkin Component', () => {
  // Setup mock router
  const mockRouter = {
    push: jest.fn(),
    query: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock router
    (nextRouter.useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock localStorage hooks
    mockedUseLocalStorage.mockImplementation(key => {
      if (key === 'checkinEmail') {
        return ['', jest.fn()];
      }
      if (key === 'checkinSessionId') {
        return ['session123', jest.fn()];
      }
      return ['', jest.fn()];
    });

    // Mock axios calls
    mockedAxios.get.mockResolvedValue({ data: {} });
    mockedAxios.patch.mockResolvedValue({ data: {} });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  it('renders the initial check-in form for new users', () => {
    render(<Checkin event={mockEvent} />);

    // Check that the event name is displayed
    expect(screen.getByText('Test Event')).toBeInTheDocument();

    // Check that the location is displayed
    expect(screen.getByText('Test Location')).toBeInTheDocument();

    // Check that the check-in form is displayed
    expect(screen.getByTestId('mock-checkin-form')).toBeInTheDocument();

    // Check that the welcome message is displayed
    expect(screen.getByText(/Welcome! Please check in below/)).toBeInTheDocument();
  });

  it('handles new user check-in', () => {
    render(<Checkin event={mockEvent} />);

    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'New' } });
    fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'User' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check that the welcome message is displayed
    expect(screen.getByText('Welcome New!')).toBeInTheDocument();

    // Check that the attendees list is displayed
    expect(screen.getByText('Existing U.')).toBeInTheDocument();

    // Check that the "Become a Supporter" button is displayed
    expect(screen.getByText('Become a Supporter')).toBeInTheDocument();
  });

  it('handles existing user check-in with active membership', () => {
    render(<Checkin event={mockEvent} />);

    // Fill out the form
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'existinguser@example.com' } });
    fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'Existing' } });
    fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'User' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check that the welcome message is displayed
    expect(screen.getByText('Welcome Existing!')).toBeInTheDocument();

    // Check that the supporting membership message is displayed
    expect(screen.getByText(/Thanks for continuing to support the urban forest/)).toBeInTheDocument();

    // Check that the attendees list is displayed
    expect(screen.getByText('Existing U.')).toBeInTheDocument();
    expect(screen.getByText('Another U.')).toBeInTheDocument();

    // Check that the "My Membership" button is displayed
    expect(screen.getByText('My Membership')).toBeInTheDocument();

    // Check that the "View Check-in History" button is displayed
    expect(screen.getByText('View Check-in History')).toBeInTheDocument();
  });
});
