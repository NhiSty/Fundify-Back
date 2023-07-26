/* eslint-disable no-console */

/**
 * @fileoverview
 * This file is the entry point of the application.
 * It creates the server and listens to the port defined in the environment variables.
 * It also handles the errors.
 * @module server
 * @requires app
 * @see {@link https://nodejs.org/api/http.html#http_class_http_server|Node.js http.Server}
 */
const http = require('http');
const logger = require('morgan');
const app = require('./app');

const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 * @function normalizePort
 * @param {string} val - Port number
 * @returns {number|string|boolean} - Port number, string or false
 * @see {@link https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback|Node.js net.Server.listen()}
 *
 * @example <caption>Example usage of normalizePort()</caption>
 * const port = normalizePort(process.env.PORT || '3000');
 * app.set('port', port);
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(`${process.env.PORT}` || '3000');
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 * @function errorHandler
 * @param {Object} error - Error object
 * @see {@link https://nodejs.org/api/errors.html#errors_class_error|Node.js Error}
 */
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.use(logger('dev'));

server.on('error', errorHandler);
server.on('listening', () => {
  console.log(`
  ______               _ _  __       
  |  ___|             | (_)/ _|      
  | |_ _   _ _ __   __| |_| |_ _   _ 
  |  _| | | | '_ \\ / _\` | |  _| | | |
  | | | |_| | | | | (_| | | | | |_| |
  \\_|  \\__,_|_| |_|\\__,_|_|_|  \\__, |
                                __/ |
                               |___/ 
 `);
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  const boxWidth = bind.length + 25;
  // Dessiner la boîte supérieure
  console.log(`+${'-'.repeat(boxWidth - 2)}+`);
  console.log(`|${' '.repeat(boxWidth - 2)}|`);
  // Dessiner le message avec le cadre gauche et droit
  console.log('|      Server is running \u{1F680}      |');
  console.log(`|     Listening on \x1b[1m${bind}\x1b[0m     |`);
  console.log(`|${' '.repeat(boxWidth - 2)}|`);
  // Dessiner la boîte inférieure
  console.log(`+${'-'.repeat(boxWidth - 2)}+`);
  console.log('\x1b[0m');
  // 'Waiting database connection' message in italic
  console.log('\x1b[3mWaiting database connection...\x1b[0m');
  console.log('\x1b[0m');
});

/**
 * Listen on provided port, on all network interfaces.
 * @name listen
 * @function listen
 * @param {number} port - Port number
 * @see {@link https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback|Node.js net.Server.listen()}
 */
server.listen(port);
