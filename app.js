'use strict';
const config = require('./config');
const server = require('./server');

server.listen(config.port, function () {
  console.log(`Listening on port ${config.port}`);
});
