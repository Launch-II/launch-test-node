const terminal = require('../terminal');

const commsTickRate = 20;
// Disregard this file!
class LaunchGame {
  constructor(config) {
    this.config = config;
    // const Allegience = {
    //   YOU,
    //   ALLY,
    //   AFFILIATE,
    //   ENEMY,
    //   NEUTRAL,
    //   PENDING_TREATY,
    // };
    this.alliances = [];
    this.treaties = [];
    this.players = [];
    this.missiles = [];
    this.interceptors = [];
    this.missileSites = [];
    this.SAMSites = [];
    this.sentryGuns = [];
    this.oreMines = [];
    this.loots = [];
    this.radiations = [];
  }
  CommsTick(tickRate) {}
  StartServices() {
    // At the rate of 20ms, run CommsTick
    setInterval(CommsTick(commsTickRate), commsTickRate);

    // At the rate of 1000ms, run GameTick
    // setInterval(GameTick(this.config.tickRate), this.config.tickRate);

    terminal.log('Game cycle started!', 'lifeCycle');
  }

  //   async GameTick(tickrate) {
  //     players.forEach((player, idx) => {
  //       if (!player.awol) {
  //         player.Tick(tickrate);
  //       }
  //     });
  //     missiles.forEach((missile, idx) => {
  //       missile.Tick(tickrate);

  //       if (missile.flying) {
  //         let missileType = config.GetMissileType(missile.cType);

  //         let geoTarget = missile.geoTarget;

  //         if (
  //           missile.geoPosition.MoveToward(
  //             geoTarget,
  //             config.getMissileSpeed(type.getSpeedIndex())
  //           )
  //         ) {
  //           // I guess this returns true if the missile reaches its target?
  //           missile.setPosition(geoTarget);
  //           MissileExploded(missile);
  //           missile.Destroy();
  //           missiles.splice(idx, 1);
  //           EntityRemoved(missile);
  //         }
  //       } else {
  //         missiles.splice(idx, 1);
  //       }
  //     });
  // interceptors.forEach((interceptor, idx) => {});
  // missileSites.forEach((missileSite, idx) => {});
  // SAMsites.forEach((SAMsite, idx) => {});
  // sentryGuns.forEach((sentryGun, idx) => {});
  // oreMines.forEach((oreMine, idx) => {});
  // loots.forEach((loot, idx) => {});
  // radiations.forEach((radiation, idx) => {});
  //   }
}

module.exports.LaunchGame = LaunchGame;
