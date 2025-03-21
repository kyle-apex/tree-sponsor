const next = require('next');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const { prisma } = require('./utils/prisma/init.js');

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
console.log('in server.js');
app.prepare().then(() => {
  console.log('app prepared');
  const handleSubdomainRedirects = async (req, res, next) => {
    const host = req.headers.host;
    //console.log('host', host);
    const subdomain = host.split('.')[0]; // Extract subdomain
    //console.log('subdomain', subdomain);
    if (subdomain && subdomain != 'www') {
      // Redirect to another page or route
      let subdomainRedirect;
      try {
        subdomainRedirect = await prisma.subdomainRedirect.findFirst({ where: { subdomain } });
        //console.log('subdomainredirect', subdomainRedirect)
        // eslint-disable-next-line no-empty
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

  console.log('Running https at', 'https://localhost:3443');
  axios.get('https://localhost:3443/api/init-data');
});

var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

if (!dev) {
  app.use(forceSsl);
}
