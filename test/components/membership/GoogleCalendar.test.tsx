import { render } from 'test/test-utils';
import GoogleCalendar from 'components/membership/GoogleCalendar';

describe('GoogleCalendar', () => {
  it('should have an iframe src for a google calendar', () => {
    const { container } = render(<GoogleCalendar></GoogleCalendar>);

    expect(container.firstChild).toHaveAttribute('src', expect.stringContaining('calendar.google.com'));
  });
});
