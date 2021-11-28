import { render, mockSession, findByText } from 'test/test-utils';
import CommentDisplay from 'components/comments/CommentDisplay';
import { PartialComment } from 'interfaces';
import userEvent from '@testing-library/user-event';

const testDate = new Date('2021-01-01 12:00');
testDate.setFullYear(new Date().getFullYear());
const comment: PartialComment = { text: 'Hello World', user: { id: 1 }, createdDate: testDate, id: 1 };

const onDelete = jest.fn();

describe('CommentDisplay', () => {
  it('should display comment text', () => {
    const { getByText } = render(<CommentDisplay comment={comment}></CommentDisplay>);
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('should display links as a link', () => {
    const { getByText } = render(<CommentDisplay comment={{ text: 'Hello https://google.com', user: {} }}></CommentDisplay>);
    const link = getByText('https://google.com');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('should not display a delete icon if it is not my comment', () => {
    const { queryByRole } = render(<CommentDisplay comment={comment} currentUserId={2} onDelete={onDelete}></CommentDisplay>);
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('should display a delete icon for my comment', () => {
    const { getByRole } = render(<CommentDisplay comment={comment} currentUserId={1} onDelete={onDelete}></CommentDisplay>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should display delete confirmation dialog', async () => {
    const { getByRole, findByText } = render(<CommentDisplay comment={comment} currentUserId={1} onDelete={onDelete}></CommentDisplay>);
    userEvent.click(getByRole('button'));

    expect(await findByText('Are you sure you wish to remove this comment?')).toBeInTheDocument();
  });

  it('should call onDelete', async () => {
    const { getByRole, findByText } = render(<CommentDisplay comment={comment} currentUserId={1} onDelete={onDelete}></CommentDisplay>);
    userEvent.click(getByRole('button'));
    userEvent.click(await findByText('Confirm'));
    expect(onDelete).toHaveBeenCalled();
  });

  it('should format the comment date', () => {
    const { getByText } = render(<CommentDisplay comment={comment}></CommentDisplay>);
    expect(getByText('Jan 1')).toBeInTheDocument();
  });
});
