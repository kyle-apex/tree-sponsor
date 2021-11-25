/**
 * @jest-environment jsdom
 */

import { mockSession, render, screen } from 'test/test-utils';
import ReactionButton from 'components/reactions/ReactionButton';
import { PartialReaction } from 'interfaces';

const reactions: PartialReaction[] = [{ userId: 1 }];
const otherUserReactions: PartialReaction[] = [{ userId: 2 }];

const onUnauthenticated = () => {
  return;
};

describe('ReactionButton', () => {
  it('renders "like" text', () => {
    render(<ReactionButton sponsorshipId={1} reactions={reactions} onUnauthenticated={onUnauthenticated}></ReactionButton>);

    const likeText = screen.getByText('Like');

    expect(likeText).toBeInTheDocument();
  });

  it('displays "info" color when logged in', () => {
    mockSession({
      user: { id: 1 },
    });
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={reactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    expect(container.firstChild).toHaveClass('MuiButton-textInfo');
  });

  it('does not display "info" color when not liked by current user', () => {
    mockSession({
      user: { id: 1 },
    });
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={otherUserReactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    expect(container.firstChild).not.toHaveClass('MuiButton-textInfo');
  });

  it('does not display "info" color when not logged in', () => {
    mockSession({});
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={otherUserReactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    expect(container.firstChild).not.toHaveClass('MuiButton-textInfo');
  });
});
