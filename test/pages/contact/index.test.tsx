/**
 * @jest-environment jsdom
 */

import { render, screen } from 'test/test-utils';
import Contact from 'pages/contact';

describe('Contact', () => {
  it('renders a heading', () => {
    render(<Contact />);

    const heading = screen.getByText('Contact Us');

    expect(heading).toBeInTheDocument();
  });
});
