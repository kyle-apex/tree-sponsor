import { render } from 'test/test-utils';
import NotchedOutlineLabel from 'components/layout/NotchedOutlineLabel';

describe('NotchedOutlineLabel', () => {
  it('should render a label', () => {
    const { getByText, getAllByText } = render(<NotchedOutlineLabel label='My Label'>Content</NotchedOutlineLabel>);
    expect(getAllByText('My Label')).toHaveLength(2);
    expect(getByText('Content')).toBeInTheDocument();
  });
});
