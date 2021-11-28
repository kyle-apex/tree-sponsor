import { render, mockSession } from 'test/test-utils';
import CommentDisplay from 'components/comments/CommentDisplay';
import { PartialComment } from 'interfaces';
const testDate = new Date('2021-01-01 12:00');
testDate.setFullYear(new Date().getFullYear());
const comment: PartialComment = { text: 'Hello World', user: { id: 1 }, createdDate: testDate };

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
    const { getByRole } = render(<CommentDisplay comment={comment}></CommentDisplay>);
    expect(getByRole('button')).not.toBeInTheDocument();
  });

  it('should display a delete icon for my comment', () => {
    mockSession({ user: { id: 1 } });
    const { getByRole } = render(<CommentDisplay comment={comment}></CommentDisplay>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should format the comment date', () => {
    const { getByText } = render(<CommentDisplay comment={comment}></CommentDisplay>);
    expect(getByText('Jan 1')).toBeInTheDocument();
  });
});
