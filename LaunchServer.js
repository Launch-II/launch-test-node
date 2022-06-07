console.log('Loading LaunchServer.js');
// Dependencies

// Imports
const internalConfig = require('./internalConfig.json');
const gameLoader = require('./storage/gameLoader');
const { GameSaver } = require('./storage/GameSaver');

const gameSimulation = require('./gameSimulation');
const commsService = require('./commsService');

const config = gameLoader.loadConfig();

const LaunchServer = () => {
  if (config) {
    // Load the game
    console.log('Loading game...');
    gameLoader.loadGame();
    console.log('...game loaded.');
    // Start game simulation
    gameSimulation.start(config);

    // Starts comms service
    commsService.start(config);

    setInterval(() => {
      // Tick the commsServe and gameSimulation every tick
      commsService.tick();
      gameSimulation.tick();
    }, config.tickRate);
  }
};
module.exports.LaunchServer = LaunchServer;
