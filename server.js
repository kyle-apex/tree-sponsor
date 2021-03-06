const next = require('next');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const ports = {
  http: 3080,
  https: 3443,
};
// eslint-disable-next-line no-undef
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt'),
};

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  http.createServer(server).listen(ports.http);
  https.createServer(options, server).listen(ports.https);
  console.log('Running https at', 'https://localhost:3443');
});
