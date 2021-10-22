/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import TFYPAboutSection from 'components/index/TFYPAboutSection';

describe('Home', () => {
  it('renders section titles', () => {
    render(<TFYPAboutSection></TFYPAboutSection>);

    const heading = screen.getByText('Education');

    expect(heading).toBeInTheDocument();
  });
});
