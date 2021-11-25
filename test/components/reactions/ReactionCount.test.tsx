/**
 * @jest-environment jsdom
 */

import { render, screen } from 'test/test-utils';
import ReactionCount from 'components/reactions/ReactionCount';
import { PartialReaction } from 'interfaces';

const reactions: PartialReaction[] = [{}, {}];
const empty: PartialReaction[] = undefined;

fdescribe('ReactionCount', () => {
  it('renders the reaction count', () => {
    render(<ReactionCount reactions={reactions}></ReactionCount>);

    const count = screen.getByText('2');

    expect(count).toBeInTheDocument();
  });

  it('renders 0 for undefined array', () => {
    render(<ReactionCount reactions={empty}></ReactionCount>);

    const count = screen.getByText('0');

    expect(count).toBeInTheDocument();
  });
});
