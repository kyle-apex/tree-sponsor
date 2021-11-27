import { render } from 'test/test-utils';
import LaunchPortalButton from 'components/account/subscriptions/LaunchPortalButton';
import userEvent from '@testing-library/user-event';

describe('LaunchPortalButton', () => {
  it('should render a button', () => {
    const { getByRole } = render(<LaunchPortalButton></LaunchPortalButton>);

    expect(getByRole('button')).toHaveTextContent('Manage');
  });

  it('should display a loading spinner when clicked', () => {
    const { getByRole, queryByRole } = render(<LaunchPortalButton></LaunchPortalButton>);

    expect(queryByRole('progressbar')).not.toBeInTheDocument();

    userEvent.click(getByRole('button'));

    expect(getByRole('progressbar')).toBeInTheDocument();
  });
});
