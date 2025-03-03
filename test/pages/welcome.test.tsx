import { render, screen, waitFor, act } from '@testing-library/react';
import WelcomePage from '../../pages/e/[path]/welcome';
import axios from 'axios';
import { PartialEvent } from '../../interfaces';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the event data
const mockEvent: PartialEvent = {
  id: 1,
  name: 'Test Event',
  path: 'test-event',
  startDate: new Date(),
  endDate: new Date(),
  categories: [],
  location: {},
  organizers: [],
};

describe('WelcomePage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Enable fake timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  it('shows welcome message for new check-ins', async () => {
    // Mock initial API call to return empty list
    mockedAxios.get.mockImplementationOnce((url: string) =>
      Promise.resolve({
        data: {
          attendees: [],
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
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Wait for initial attendees to be displayed
    await waitFor(() => {
      expect(screen.getByText('(0)')).toBeInTheDocument();
    });

    // Advance timers to trigger polling
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Wait for the new attendee to be displayed
    await waitFor(() => {
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    // Wait for the welcome message to appear
    await waitFor(
      () => {
        const welcomeMessage = screen.getByText('Welcome New Person');
        expect(welcomeMessage).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Advance timers to wait for the welcome message to disappear
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verify the welcome message is gone
    await waitFor(
      () => {
        const welcomeMessage = screen.queryByText('Welcome New Person');
        expect(welcomeMessage).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
