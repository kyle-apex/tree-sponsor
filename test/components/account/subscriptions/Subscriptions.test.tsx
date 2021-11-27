import { render, useServer } from 'test/test-utils';
import Subscriptions from 'components/account/subscriptions/Subscriptions';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { SubscriptionWithDetails } from '@prisma/client';

const subscriptions: Partial<SubscriptionWithDetails>[] = [{ productName: 'TFYP Membership' }];

const server = setupServer(
  rest.get('/api/me/subscriptions', (_req, res, ctx) => {
    return res(ctx.json(subscriptions));
  }),
);

useServer(server);

describe('Subscriptions', () => {
  it('should display a loading indicator', () => {
    const { getByText } = render(<Subscriptions></Subscriptions>);

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should display a loading indicator', () => {
    const { getByText } = render(<Subscriptions></Subscriptions>);

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should display the product name', async () => {
    const { findByText } = render(<Subscriptions></Subscriptions>);

    expect(await findByText('TFYP Membership')).toBeInTheDocument();
  });
});
