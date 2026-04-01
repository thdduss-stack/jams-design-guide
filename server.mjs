import fs from 'fs';
import { createServer as http } from 'http';
import { createServer as https } from 'https';
import { networkInterfaces } from 'os';
import path from 'path';
import { parse } from 'url';
import next from 'next';

const networkInterface = networkInterfaces();

const ports = {
  http: 3200,
  https: 4200,
};

const certDir = path.resolve(process.cwd(), './cert/local-cert.pem');
const keyDir = path.resolve(process.cwd(), './cert/local-key.pem');

const httpsOptions = {
  key: fs.readFileSync(keyDir),
  cert: fs.readFileSync(certDir),
  requestCert: false,
  rejectUnauthorized: false,
};

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'hiringcenter.local.jobkorea.co.kr';
const port = ports.https;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const localAddress = networkInterface['en0']?.find(({ family }) => family === 'IPv4')?.['address'];
  const strings = {
    ready: '[ \x1b[32mready\x1b[0m ]',
    http: '\x1b[43mHTTP\x1b[0m',
    https: '\x1b[44mHTTPS\x1b[0m',
  };

  http((req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  }).listen(ports.http, err => {
    if (err) throw err;
    console.log(`${strings.http}  ${strings.ready} on http://localhost:${ports.http}`);
    console.log(`${strings.http}  ${strings.ready} on http://${localAddress}:${ports.http}`);
  });

  https(httpsOptions, (req, res) => {
    req.headers['x-forwarded-for'] = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  }).listen(ports.https, err => {
    if (err) throw err;
    console.log(`${strings.https} ${strings.ready} on https://${hostname}:${ports.https}`);
    console.log(`${strings.https} ${strings.ready} on https://${localAddress}:${ports.https}`);
  });
});
``;
