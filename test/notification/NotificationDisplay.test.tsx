import NotificationDisplay from 'components/notification/NotificationDisplay';
import { render } from 'test/test-utils';
import { PartialNotification } from 'interfaces';

const announcement: PartialNotification = { id: 1, type: 'announcement', parameter: 'This is the announcement!' };
const comment: PartialNotification = { id: 2, type: 'comment', parameter: 'My Tree' };
const reaction: PartialNotification = { id: 3, type: 'reaction', parameter: 'Other Tree' };

const onAction = jest.fn();

describe('NotificationMenu', () => {
  it('should render an announcement', () => {
    const { getByText } = render(<NotificationDisplay notification={announcement} onAction={onAction} />);
    expect(getByText('This is the announcement!')).toBeInTheDocument();
  });

  it('should render a comment notification', () => {
    const { getByText } = render(<NotificationDisplay notification={comment} onAction={onAction} />);
    expect(getByText('Anonymous')).toBeInTheDocument();
    expect(getByText('commented on')).toBeInTheDocument();
    expect(getByText('My Tree')).toBeInTheDocument();
  });

  it('should render a reaction notification', () => {
    const { getByText } = render(<NotificationDisplay notification={reaction} onAction={onAction} />);
    expect(getByText('Anonymous')).toBeInTheDocument();
    expect(getByText('liked')).toBeInTheDocument();
    expect(getByText('Other Tree')).toBeInTheDocument();
  });
});
