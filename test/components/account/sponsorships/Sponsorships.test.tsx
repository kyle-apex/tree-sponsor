import { render, useServer, waitFor, screen } from 'test/test-utils';
import Sponsorships from 'components/account/sponsorships/Sponsorships';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const sponsorships = [{ id: 1 }];

const server = setupServer(
  rest.get('/api/me/sponsorships', (_req, res, ctx) => {
    return res(ctx.json(sponsorships));
  }),
);

useServer(server);

describe('Sponsorships', () => {
  it('should display a new subscription option when all tokens are used', async () => {
    sponsorships.splice(0, sponsorships.length);
    sponsorships.push({ id: 1 });
    sponsorships.push({ id: 2 });
    const { findByText } = render(<Sponsorships activeDonationAmount={40}></Sponsorships>);

    expect(await findByText('Start a new subscription!')).toBeInTheDocument();
  });

  it('should display a warning if no donation amount is specified', async () => {
    sponsorships.splice(0, sponsorships.length);
    sponsorships.push({ id: 1 });
    const { findByText } = render(<Sponsorships></Sponsorships>);
    expect(await findByText('You do not have any available Tokens of Appre-tree-ation.')).toBeInTheDocument();
  });

  it('should display how many available token you have', async () => {
    const { findByText } = render(<Sponsorships activeDonationAmount={60}></Sponsorships>);
    expect(await findByText('3')).toBeInTheDocument();
  });

  it('should display your configured token count', async () => {
    sponsorships.splice(0, sponsorships.length);
    sponsorships.push({ id: 2 });
    const { findByText } = render(<Sponsorships activeDonationAmount={60}></Sponsorships>);
    expect(await findByText('1')).toBeInTheDocument();
  });

  it('should display an add button if you have available tokens', async () => {
    sponsorships.splice(0, sponsorships.length);
    const { findAllByText } = render(<Sponsorships activeDonationAmount={60}></Sponsorships>);
    waitFor(async () => {
      expect(await findAllByText('Click to Thank-a-Tree!')).toHaveLength(3);
    });
  });
});
