var net = require('net');

// const { ClientSession } = require('./ClientSession');
const { ClientSession } = require('./clientSession');
var sessions = [];
var dispatchList = [];

var activeSessions = 0;

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Socket = new Server(server);
const a = 't';

module.exports.tick = () => {
  sessions.forEach((session, idx) => {
    session.Tick();
  });
};

module.exports.start = start = (config) => {
  // const Server = new net.createServer((client) => onClientConnection(client));
  server.listen(config.port);

  Socket.on('connection', (client) => {
    // When a client connects to the server we just created, create a new async session for them.
    // console.log('Socket connection!');
    let sessionID = sessions?.length + 1 || 0;
    let session = new ClientSession(sessionID, client);
    activeSessions++;
    sessions.push(session);
  });
};

// module.exports.onClientConnection = onClientConnection = (client) => {

// };

module.exports.closeSession = closeSession = (sessionID) => {
  sessions.forEach((obj, idx) => {
    if (obj.sessionID == sessionID) {
      console.log(`Session ${obj.sessionID} closed`);
      sessions.splice(idx, 1);
    }
  });
};

module.exports.entityUpdated = (entity, bOwner) => {};
module.exports.allianceUpdated = (entity, bOwner) => {};
