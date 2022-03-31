import { mockSession, render } from 'test/test-utils';
import CommentSection from 'components/comments/CommentSection';
import { PartialComment } from 'interfaces';

const comments: PartialComment[] = [
  { text: 'Hello World', user: {} },
  { text: 'Other World', user: {} },
];

describe('CommentDisplay', () => {
  it('should display multiple comments', () => {
    const { getByText, queryByText } = render(<CommentSection comments={comments} sponsorshipId={1}></CommentSection>);
    expect(getByText('Hello World')).toBeInTheDocument();
    expect(getByText('Other World')).toBeInTheDocument();
    expect(queryByText('Login to leave a comment')).not.toBeInTheDocument();
  });

  it('should display a link to login if logged out', () => {
    mockSession(null);
    const { getByText } = render(<CommentSection comments={comments} sponsorshipId={1}></CommentSection>);
    expect(getByText('Login to leave a comment')).toBeInTheDocument();
  });

  it('should display progress bar if fetching', () => {
    const { container } = render(<CommentSection comments={comments} sponsorshipId={1} isFetching={true}></CommentSection>);
    expect(container.querySelector('.MuiSkeleton-text')).toBeInTheDocument();
  });
});
