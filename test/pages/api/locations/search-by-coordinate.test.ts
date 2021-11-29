import { testApiHandler } from 'next-test-api-route-handler';
// Import the handler under test from the pages/api directory
import endpoint from 'pages/api/locations/search-by-coordinate';

// Respect the Next.js config object if it's exported
const handler: typeof endpoint = endpoint;
describe('test', () => {
  it('should', async () => {
    expect.assertions(1);

    await testApiHandler({
      handler,
      requestPatcher: req => (req.headers = { long: '-97.76905' }),
      params: { long: '-97.769053', lat: '30.2453' },
      url: '/api/locations/search-by-coordinate',
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const locations = await res.json();
        //console.log(await res.json());
        expect(locations[0].name).toBe('The ABGB');
      },
    });
  });
});
