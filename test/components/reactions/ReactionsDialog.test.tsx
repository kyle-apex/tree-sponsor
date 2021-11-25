/**
 * @jest-environment jsdom
 */

import { mockSession, render } from 'test/test-utils';
import ReactionsDialog from 'components/reactions/ReactionsDialog';
import { PartialReaction } from 'interfaces';

const reactions: PartialReaction[] = [
  { id: 1, user: { displayName: 'John Smith' } },
  { id: 2, user: { name: 'J Smith' } },
];

const open = true;
const setOpen = (isOpen: boolean) => {
  return;
};

describe('ReactionsDialog', () => {
  it('should render reaction display name', () => {
    const { getByText } = render(<ReactionsDialog open={open} setOpen={setOpen} reactions={reactions}></ReactionsDialog>);

    expect(getByText('John Smith')).toBeInTheDocument();
    expect(getByText('J Smith')).toBeInTheDocument();
  });

  it('should not render a closed dialog', () => {
    const { queryByText } = render(<ReactionsDialog open={false} setOpen={setOpen} reactions={reactions}></ReactionsDialog>);

    expect(queryByText('John Smith')).not.toBeInTheDocument();
  });
});
