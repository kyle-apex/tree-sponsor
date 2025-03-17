/**
 * @jest-environment jsdom
 */

import { render, waitFor } from 'test/test-utils';
import CheckinRedirect, { getServerSideProps } from 'pages/checkin';
import { prismaMock } from 'utils/prisma/singleton';
import { useRouter } from 'next/router';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock mui-rte to avoid issues with ES modules
jest.mock('mui-rte', () => {
  return {
    __esModule: true,
    default: (): null => null,
  };
});

// Mock TextEditor component
jest.mock('components/TextEditor', () => {
  return {
    __esModule: true,
    default: (): null => null,
  };
});

describe('CheckinRedirect', () => {
  const mockUseRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockUseRouter);
  });

  it('redirects to the event checkin page', async () => {
    render(<CheckinRedirect path='test-event' />);

    // Check that router.push was called with the correct path
    await waitFor(() => {
      expect(mockUseRouter.push).toHaveBeenCalledWith('/e/test-event/checkin');
    });
  });

  describe('getServerSideProps', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns the path of the most recent event', async () => {
      // Mock the Prisma findFirst method to return an event
      // Only include the fields that are actually used in the component
      // @ts-expect-error - Prisma types have circular references that cause TypeScript errors
      prismaMock.event.findFirst.mockResolvedValue({
        path: 'test-event',
      } as any); // Using 'as any' to bypass type checking for the mock

      const result = await getServerSideProps();

      // Check that Prisma was called with the correct parameters
      expect(prismaMock.event.findFirst).toHaveBeenCalledWith({
        where: {
          startDate: { lt: expect.any(Date) },
          isPrivate: { not: true },
        },
        orderBy: { startDate: 'desc' },
      });

      // Check that the function returns the correct path
      expect(result).toEqual({
        props: {
          path: 'test-event',
        },
      });
    });

    it('returns an empty string when no event is found', async () => {
      // Mock the Prisma findFirst method to return null (no event found)
      prismaMock.event.findFirst.mockResolvedValue(null);

      const result = await getServerSideProps();

      // Check that Prisma was called with the correct parameters
      expect(prismaMock.event.findFirst).toHaveBeenCalledWith({
        where: {
          startDate: { lt: expect.any(Date) },
          isPrivate: { not: true },
        },
        orderBy: { startDate: 'desc' },
      });

      // Check that the function returns an empty string as the path
      expect(result).toEqual({
        props: {
          path: '',
        },
      });
    });
  });
});
