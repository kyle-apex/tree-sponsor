import { render } from 'test/test-utils';
import ShareMenu from 'components/share/ShareMenu';
import { PartialSponsorship } from 'interfaces';
import userEvent from '@testing-library/user-event';

const setAnchorEl = jest.fn();
const button = document.createElement('button');
const sponsorship: PartialSponsorship = { user: { profilePath: 'the-path' } };

describe('ShareMenu', () => {
  it('should display a share to facebook item', () => {
    const { getByText } = render(<ShareMenu setAnchorEl={setAnchorEl} anchorEl={button} sponsorship={sponsorship}></ShareMenu>);
    expect(getByText('Share to Facebook')).toBeInTheDocument();
  });

  it('should display a snackbar after clicking copy link menu item', async () => {
    const { findByText } = render(<ShareMenu setAnchorEl={setAnchorEl} anchorEl={button} sponsorship={sponsorship}></ShareMenu>);

    const copyLink = await findByText('Copy Link');
    expect(copyLink).toBeInTheDocument();

    userEvent.click(copyLink);

    expect(await findByText('Copied to clipboard!')).toBeInTheDocument();
  });
});
