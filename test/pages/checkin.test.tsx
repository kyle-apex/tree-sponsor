/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckinRedirect, { getServerSideProps } from 'pages/checkin';
import { useRouter } from 'next/router';
import { prisma } from 'utils/prisma/init';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the prisma client
jest.mock('utils/prisma/init', () => ({
  prisma: {
    event: {
      findFirst: jest.fn(),
    },
  },
}));

describe('CheckinRedirect', () => {
  it('redirects to the event checkin page', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<CheckinRedirect path='test-event' />);

    expect(mockPush).toHaveBeenCalledWith('/e/test-event/checkin');
  });
});

describe('getServerSideProps', () => {
  it('returns the path of the most recent event', async () => {
    const mockEvent = {
      path: 'test-event',
    };

    (prisma.event.findFirst as jest.Mock).mockResolvedValue(mockEvent);

    const result = await getServerSideProps();

    expect(result).toEqual({
      props: {
        path: 'test-event',
      },
    });
  });

  it('returns an empty string when no event is found', async () => {
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await getServerSideProps();

    expect(result).toEqual({
      props: {
        path: '',
      },
    });
  });
});
