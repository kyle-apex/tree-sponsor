import { render } from 'test/test-utils';
import EditProfile from 'components/account/profile/EditProfile';
import userEvent from '@testing-library/user-event';

describe('EditProfile', () => {
  it('should display the form', () => {
    const { getByLabelText } = render(<EditProfile></EditProfile>);
    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Profile Path')).toBeInTheDocument();
  });

  it('should have a disabled save button', () => {
    const { getByRole } = render(<EditProfile></EditProfile>);
    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
  });

  it('should have enabled save button after change', () => {
    const { getByRole, getByLabelText } = render(<EditProfile></EditProfile>);
    userEvent.type(getByLabelText('Name'), 'A');
    expect(getByRole('button', { name: 'Save' })).not.toHaveAttribute('disabled');
  });
});
