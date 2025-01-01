const { createServer } = require('http');
const next = require('next');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = dev ? 3443 : process.env.PORT;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const host = req.headers.host;
    const subdomain = host.split('.')[0]; // Extract subdomain
    if (subdomain && subdomain != 'www' && subdomain != 'tfyp' && subdomain != 'treefolksyp-dev') {
      // Redirect to another page or route
      let subdomainRedirect;
      try {
        subdomainRedirect = await prisma.subdomainRedirect.findFirst({ where: { subdomain } });
        // eslint-disable-next-line no-empty
      } catch (err) {}
      if (subdomainRedirect?.redirect) {
        res.writeHead(302, { location: subdomainRedirect.redirect });
        res.end();
      } else await handle(req, res);
    } else {
      await handle(req, res);
    }
  })
    .once('error', err => {
      console.error('got an error', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
