import { render } from 'test/test-utils';
import MembershipPerks from 'components/membership/MembershipPerks';

describe('MembershipPerks', () => {
  it('should link to instagram', () => {
    const { getByText } = render(<MembershipPerks></MembershipPerks>);

    expect(getByText(/treefolks_yp/i)).toBeInTheDocument();
  });
});
