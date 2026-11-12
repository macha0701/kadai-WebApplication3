'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const Cookies = require('cookies');
const router = require('./lib/router');

const userIdKey = 'todoUserId';

const server = http.createServer((req, res) => {
  const cookies = new Cookies(req, res);
  let userId = cookies.get(userIdKey);
  // cookieがない、または形式が違うときは、新しいIDを発行する
  if (!userId || !/^[0-9a-f]{32}$/.test(userId)) {
    userId = crypto.randomBytes(16).toString('hex');
  }
  cookies.set(userIdKey, userId, { maxAge: 365 * 86400 * 1000, httpOnly: true });
  req.user = userId;
  router.route(req, res);
})
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});