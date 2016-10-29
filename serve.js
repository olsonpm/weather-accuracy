'use strict';

const http = require('http');

const reqListener = (req, res) => {
  return handleRequest(req, res);
};

http.createServer(reqListener)
  .listen(8080);

const handleRequest = require('./release/index.pack').getRequestListener('');

console.log('listening on port 8080');
