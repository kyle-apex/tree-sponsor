import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserAvatarsRowWithLabel from './UserAvatarsRowWithLabel';
import { PartialUser } from 'interfaces';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const customRender = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('UserAvatarsRowWithLabel', () => {
  const mockUsers: PartialUser[] = [
    { id: 1, name: 'User 1', displayName: 'Display 1' },
    { id: 2, name: 'User 2', displayName: 'Display 2' },
    { id: 3, name: 'User 3', displayName: 'Display 3' },
  ];

  const baseProps = {
    users: mockUsers,
    label: 'Test Users',
    baseColor: '#000000',
  };

  it('renders without crashing', () => {
    customRender(<UserAvatarsRowWithLabel {...baseProps} />);
    expect(screen.getByText('3 Test Users')).toBeInTheDocument();
  });

  it('handles empty users array', () => {
    customRender(<UserAvatarsRowWithLabel {...baseProps} users={[]} />);
    expect(screen.getByText('0 Test Users')).toBeInTheDocument();
  });

  it('handles single user with plural label', () => {
    customRender(<UserAvatarsRowWithLabel {...baseProps} users={[mockUsers[0]]} />);
    expect(screen.getByText('1 Test User')).toBeInTheDocument();
  });

  it('respects maxDisplayedAvatars prop', () => {
    const manyUsers: PartialUser[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      displayName: `Display ${i + 1}`,
    }));

    const { container } = customRender(<UserAvatarsRowWithLabel {...baseProps} users={manyUsers} maxDisplayedAvatars={10} />);

    // Should show all 20 users in the count
    expect(screen.getByText('20 Test Users')).toBeInTheDocument();

    // But only render 10 avatar elements
    const avatars = container.querySelectorAll('[data-testid^="user-avatar"]');
    expect(avatars.length).toBe(10);
  });

  it('uses default maxDisplayedAvatars when not provided', () => {
    const manyUsers: PartialUser[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      displayName: `Display ${i + 1}`,
    }));

    const { container } = customRender(<UserAvatarsRowWithLabel {...baseProps} users={manyUsers} />);

    // Should show all 20 users in the count
    expect(screen.getByText('20 Test Users')).toBeInTheDocument();

    // But only render default number (12) of avatar elements
    const avatars = container.querySelectorAll('[data-testid^="user-avatar"]');
    expect(avatars.length).toBe(12);
  });

  it('uses displayName over name for avatar', () => {
    customRender(<UserAvatarsRowWithLabel {...baseProps} users={[mockUsers[0]]} />);
    const avatar = screen.getByTestId('user-avatar-1');
    expect(avatar).toHaveTextContent('D'); // First letter of 'Display 1'
  });

  it('falls back to name when displayName is not provided', () => {
    const userWithoutDisplayName: PartialUser = {
      id: 1,
      name: 'Name Only',
    };
    customRender(<UserAvatarsRowWithLabel {...baseProps} users={[userWithoutDisplayName]} />);
    const avatar = screen.getByTestId('user-avatar-1');
    expect(avatar).toHaveTextContent('N'); // First letter of 'Name Only'
  });

  it('shows ? when neither name nor displayName is provided', () => {
    const userWithNoName: PartialUser = {
      id: 1,
    };
    customRender(<UserAvatarsRowWithLabel {...baseProps} users={[userWithNoName]} />);
    const avatar = screen.getByTestId('user-avatar-1');
    expect(avatar).toHaveTextContent('?');
  });
});
