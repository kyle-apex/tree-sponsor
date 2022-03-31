import { render, useServer } from 'test/test-utils';
import EditProfile from 'components/account/profile/EditProfile';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/me', (_req, res, ctx) => {
    const result = res(ctx.json({ name: 'Kyle', profilePath: 'kyle' }));
    return result;
  }),
);

useServer(server);

describe('EditProfile', () => {
  it('should not display form until data is loaded', () => {
    const { queryByLabelText } = render(<EditProfile></EditProfile>);
    expect(queryByLabelText('Name')).not.toBeInTheDocument();
  });

  it('should display the form', async () => {
    const { findByLabelText } = render(<EditProfile></EditProfile>);
    const text = await findByLabelText('Name');
    expect(text).toBeInTheDocument();
    expect(await findByLabelText('Profile Path')).toBeInTheDocument();
  });

  it('should have a disabled save button', async () => {
    const { findByRole } = render(<EditProfile></EditProfile>);
    expect(await findByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
  });

  it('should have enabled save button after change', async () => {
    const { findByRole, findByLabelText } = render(<EditProfile></EditProfile>);
    userEvent.type(await findByLabelText('Name'), 'A');
    expect(await findByRole('button', { name: 'Save' })).not.toHaveAttribute('disabled');
  });
});
