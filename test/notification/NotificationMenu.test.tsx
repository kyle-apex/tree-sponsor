import NotificationMenu from 'components/notification/NotificationMenu';
import { render } from 'test/test-utils';
import { PartialNotification } from 'interfaces';

const notifications: PartialNotification[] = [
  { id: 1, type: 'announcement', parameter: 'This is the announcement!' },
  { id: 2, type: 'comment', parameter: 'My Tree' },
  { id: 3, type: 'reaction', parameter: 'Other Tree' },
];

const onClose = jest.fn();
const setAnchorEl = jest.fn();
const button = document.createElement('button');

describe('NotificationMenu', () => {
  it('should render an announcement', () => {
    const { getByText } = render(
      <NotificationMenu notifications={notifications} onClose={onClose} anchorEl={button} setAnchorEl={setAnchorEl} />,
    );
    expect(getByText('This is the announcement!')).toBeInTheDocument();
  });

  it('should render an comment notification', () => {
    const { getAllByText, getByText } = render(
      <NotificationMenu notifications={notifications} onClose={onClose} anchorEl={button} setAnchorEl={setAnchorEl} />,
    );
    expect(getAllByText('Anonymous')).toHaveLength(2);
    expect(getByText('commented on')).toBeInTheDocument();
    expect(getByText('My Tree')).toBeInTheDocument();
  });

  it('should render a reaction notification', () => {
    const { getByText } = render(
      <NotificationMenu notifications={notifications} onClose={onClose} anchorEl={button} setAnchorEl={setAnchorEl} />,
    );
    expect(getByText('liked')).toBeInTheDocument();
    expect(getByText('Other Tree')).toBeInTheDocument();
  });
});
