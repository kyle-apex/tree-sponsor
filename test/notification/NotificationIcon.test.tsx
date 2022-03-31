import { useServer, render } from 'test/test-utils';
import NotificationIcon from 'components/notification/NotificationIcon';
import { PartialNotification } from 'interfaces';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

const notifications: PartialNotification[] = [
  { id: 1, type: 'announcement', parameter: 'This is the announcement!', isRead: true },
  { id: 2, type: 'comment', parameter: 'My Tree' },
  { id: 3, type: 'reaction', parameter: 'Other Tree' },
];

const server = setupServer(
  rest.get('/api/me/notifications', (_req, res, ctx) => {
    return res(ctx.json(notifications));
  }),
);

useServer(server);

describe('NotificationIcon', () => {
  it('should show a count of unread notifications', async () => {
    const { findByText } = render(<NotificationIcon />);

    expect(await findByText('2')).toBeInTheDocument();
  });

  it('should show a menu after clicking the icon', async () => {
    const { findByText, getByRole, queryByText } = render(<NotificationIcon />);

    expect(queryByText('This is the announcement!')).not.toBeInTheDocument();

    const button = getByRole('button');

    userEvent.click(button);

    expect(await findByText('This is the announcement!')).toBeInTheDocument();
  });
});
