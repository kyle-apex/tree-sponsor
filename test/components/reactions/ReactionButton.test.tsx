/**
 * @jest-environment jsdom
 */

import { render, screen } from 'test/test-utils';
import ReactionButton from 'components/reactions/ReactionButton';
import client from 'next-auth/client';
import { PartialReaction } from 'interfaces';
jest.mock('next-auth/client');

const reactions: PartialReaction[] = [{ userId: 1 }];
const otherUserReactions: PartialReaction[] = [{ userId: 2 }];

const onUnauthenticated = () => {
  return;
};
const mockSession = {
  expires: '1',
  user: { email: 'a', name: 'Delta', image: 'c', id: 1 },
};

(client.useSession as jest.Mock).mockReturnValue([mockSession, false]);

describe('ReactionButton', () => {
  it('renders "like" text', () => {
    render(<ReactionButton sponsorshipId={1} reactions={reactions} onUnauthenticated={onUnauthenticated}></ReactionButton>);

    const likeText = screen.getByText('Like');

    expect(likeText).toBeInTheDocument();
  });

  it('displays "info" color when logged in', () => {
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={reactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    expect(container.firstChild).toHaveClass('MuiButton-textInfo');
  });

  it('does not display "info" color when not liked by current user', () => {
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={otherUserReactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    expect(container.firstChild).not.toHaveClass('MuiButton-textInfo');
  });

  it('does not display "info" color when not logged in', () => {
    (client.useSession as jest.Mock).mockReturnValueOnce([{}, false]);
    const { container } = render(
      <ReactionButton sponsorshipId={1} reactions={otherUserReactions} onUnauthenticated={onUnauthenticated}></ReactionButton>,
    );
    console.log('first child', container.firstChild);
    expect(container.firstChild).not.toHaveClass('MuiButton-textInfo');
  });
});
