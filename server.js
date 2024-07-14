const next = require('next');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ports = {
  http: 3080,
  https: 3443,
};
// eslint-disable-next-line no-undef
if (process.env.GITPOD_WORKSPACE_URL) {
  const urlWithPort = process.env.GITPOD_WORKSPACE_URL.replace('https://', 'https://' + ports.https + '-');
  process.env.URL = urlWithPort;
  process.env.NEXTAUTH_URL = urlWithPort;
}
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3443;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const server = express();

const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt'),
};

app.prepare().then(() => {
  var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  };
  
  if (!dev) {
    server.use(forceSsl);
  }

  const handleSubdomainRedirects = async (req, res, next) => {
    const host = req.headers.host;
    const subdomain = host.split('.')[0]; // Extract subdomain
    console.log('subdomain', subdomains);
    if (subdomain && subdomain != 'www' && subdomain != 'tfyp') {
      // Redirect to another page or route
      let subdomainRedirect;
      try {
        subdomainRedirect = await prisma.subdomainRedirect.findFirst({ where: { subdomain } });
        console.log('subdomainRedirect', subdomainRedirect);

      } catch (err) {}
      if (subdomainRedirect?.redirect) res.redirect(subdomainRedirect.redirect);
      else next();
    } else {
      next();
    }
  };

  server.use(handleSubdomainRedirects);
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  http.createServer(server).listen(ports.http);
  https.createServer(options, server).listen(ports.https);

  console.log('Running https at', dev ? 'https://localhost:3443' : process.env.URL);
  if (dev)
    axios.get('https://localhost:3443/api/init-data');
});


