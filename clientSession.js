const commsService = require('./commsService');
// const smokeSignal = require('../../SmokeSignal/smokeSignal');
const gameSimulation = require('./gameSimulation');
const ByteBuffer = require('bytebuffer');
// const shortCodes = require('../../LaunchGame/comm/commShortcodes');
const defs = require('./LaunchGame/game/internalConfig.json');
const { performance } = require('perf_hooks');
const terminal = require('./LaunchGame/terminal');
const path = require('path');
const fs = require('fs');
const {
  LaunchClientLocation,
} = require('./LaunchGame/comm/utilities/LaunchClientLocation');

// Websocket garbage
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { toSmobject } = require('./LaunchGame/helperFunctions');

var handlers = {};

const handlerFiles = fs
  .readdirSync(path.resolve(__dirname, 'handlers'))
  .filter((file) => file.endsWith('.js'));

for (const file of handlerFiles) {
  const command = require(`./handlers/${file}`);
  handlers[command.name] = command;
}

class ClientSession {
  constructor(sessionID, client) {
    console.log(`Session ${sessionID} begun`);
    this.sessionID = sessionID;
    this.client = client;
    this.messageSendList = [];
    this.NetworkEventListener();
    // console.log(client);
    this.strIPAddress = client.handshake.address.replace('::ffff:', '');
  }

  async NetworkEventListener() {
    let standardPackage = {
      gameSimulation,
    };
    this.client.on('data', (data) => {
      console.log(data);

      // When the client sends data, process it
      // smokeSignal.processBytes(data, this);
      if (!handlers[data.name]) {
        console.log(`No command named ${data.name}`);
        return;
      }
      if (handlers[data.name].requiresAuth && !this?.AuthenticatedUser) {
        this.SendMessage({ name: 'Unauthorized', type: 'Message' });
        return;
      }
      if (handlers[data.name].requiresPlayer && !this?.player) {
        this.SendMessage({ name: 'NoPlayer', type: 'Message' });
        return;
      }

      handlers[data.name].execute(this, { ...standardPackage, data });
    });

    this.client.on('close', () => {
      commsService.closeSession(this.sessionID);
    });

    this.client.on('error', (err) => {
      if (!err.errno == -4077) return console.log(err);
    });
  }

  async Tick() {
    // This runs every second once the connection is open. It will iterate over messagesSendList and send as many messages as it can before the tick is over with.
    var messagesSent = 0;
    var timeElapsed = 0;
    while (timeElapsed < 999 && this.messageSendList.length) {
      let startTime = performance.now();
      try {
        console.log('sending', this.messageSendList[0].name);
        this.client.emit('data', this.messageSendList[0]);
        messagesSent++;
      } catch (e) {
        terminal.log(e, 'error');
      }
      this.messageSendList.shift();
      let endTime = performance.now();
      timeElapsed = timeElapsed + (endTime - startTime);
    }
    if (!messagesSent) {
      if (this.keepaliveCount == 30) {
        // Send keepalive;
        terminal.log('Sending keepAlive', 'code');
        clientComms.sendCommand({ lCommand: this.KeepAlive });
        this.keepaliveCount = 0;
        return;
      }
      this.keepaliveCount++;
      return;
    }
    if (messagesSent) {
      terminal.log(`Finished with ${messagesSent} transmission(s).`, 'tick');
      return;
    }
  }

  async SendMessage(data) {
    this.messageSendList.push(toSmobject(data));
    console.table(this.messageSendList);
    return;
  }
}

module.exports.ClientSession = ClientSession;
