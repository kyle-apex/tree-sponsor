/**
 * @jest-environment jsdom
 */

import { render } from 'test/test-utils';
import ReactionCount from 'components/reactions/ReactionCount';
import { PartialReaction } from 'interfaces';

const reactions: PartialReaction[] = [{}, {}];
const empty: PartialReaction[] = undefined;

fdescribe('ReactionCount', () => {
  it('renders the reaction count', () => {
    const { getByText } = render(<ReactionCount reactions={reactions}></ReactionCount>);

    expect(getByText('2')).toBeInTheDocument();
  });

  it('renders 0 for undefined array', () => {
    const { getByText } = render(<ReactionCount reactions={empty}></ReactionCount>);

    expect(getByText('0')).toBeInTheDocument();
  });
});
