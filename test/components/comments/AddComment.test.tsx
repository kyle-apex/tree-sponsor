import { render } from 'test/test-utils';
import AddComment from 'components/comments/AddComment';
import userEvent from '@testing-library/user-event';

const onAdd = jest.fn();

describe('AddComment', () => {
  it('should display a textarea', () => {
    const { getByPlaceholderText } = render(<AddComment onAdd={onAdd}></AddComment>);
    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('should display a save button after focus', async () => {
    const { getByRole, findByText } = render(<AddComment onAdd={onAdd}></AddComment>);
    userEvent.click(getByRole('textbox'));
    const button = await findByText('Submit');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('disabled');
  });

  it('should call onAdd on submit', async () => {
    const { getByRole, findByText } = render(<AddComment onAdd={onAdd}></AddComment>);
    const input = getByRole('textbox');
    userEvent.type(input, 'Example');

    const button = await findByText('Submit');
    expect(button).not.toHaveAttribute('disabled');
    userEvent.click(button);

    expect(onAdd).toHaveBeenCalledWith('Example');
  });

  it('should hide buttons after clicking cancel', async () => {
    const { getByRole, findByText } = render(<AddComment onAdd={onAdd}></AddComment>);

    userEvent.click(getByRole('textbox'));

    const button = await findByText('Cancel');

    expect(button).toBeInTheDocument();

    userEvent.click(button);

    expect(button).not.toBeInTheDocument();
  });
});
