/**
 * @jest-environment jsdom
 */

import { render, screen } from 'test/test-utils';
import TFYPAboutSection from 'components/index/TFYPAboutSection';

describe('Home', () => {
  it('renders section titles', () => {
    render(<TFYPAboutSection></TFYPAboutSection>);

    const heading = screen.getByText('Social');

    expect(heading).toBeInTheDocument();
  });
});
