import { render } from 'test/test-utils';
import ShareButton from 'components/share/ShareButton';
import { PartialSponsorship } from 'interfaces';
import userEvent from '@testing-library/user-event';

const sponsorship: PartialSponsorship = { user: { profilePath: 'the-path' } };

describe('ShareButton', () => {
  it('should show a menu after clicking the icon', async () => {
    const { findByText, getByRole, queryByText } = render(<ShareButton sponsorship={sponsorship} />);

    expect(queryByText('Share to Facebook')).not.toBeInTheDocument();

    const button = getByRole('button');

    userEvent.click(button);

    expect(await findByText('Share to Facebook')).toBeInTheDocument();
  });
});
