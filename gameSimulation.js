const helperFunctions = require('./LaunchGame/helperFunctions');
const { Config } = require('./LaunchGame/game/Config');
const { Player } = require('./LaunchGame/game/entities/Player');
const { User } = require('./LaunchGame/game/User');

const comms = require('./commsService');

var config;

var users = [];
var players = [];
var Missiles = [];
var Interceptors = [];
var MissileSites = [];
var SAMSites = [];
var OreMines = [];
var SentryGuns = [];
var Loots = [];
var Radiations = [];
var Alliances = [];
var Treaties = [];
var AllStructures = [];

var lOurPlayerID;

module.exports.start = start = (config) => {
  this.config = config;

  console.log('gameSimStarted!');
};

module.exports.getConfig = () => {
  return this.config;
};

module.exports.getPlayerName = (userID) => {};

module.exports.getGame = () => {
  return {
    users,
    players,
    Missiles,
    Interceptors,
    MissileSites,
    SAMSites,
    OreMines,
    SentryGuns,
    Loots,
    Radiations,
    Alliances,
    Treaties,
    AllStructures,
  };
};

module.exports.tick = async () => {
  players.forEach((player, idx) => {});
  //   missiles.forEach((missile, idx) => {});
  //   interceptors.forEach((interceptor, idx) => {});
  //   missileSites.forEach((missileSite, idx) => {});
  //   SAMsites.forEach((SAMsite, idx) => {});
  //   sentryGuns.forEach((sentryGun, idx) => {});
  //   oreMines.forEach((oreMine, idx) => {});
  //   loots.forEach((loot, idx) => {});
  //   radiations.forEach((radiation, idx) => {});
  //   alliances.forEach((alliance, idx) => {});
  //   treaties.forEach((treaty, idx) => {});
};

// module.exports.getUser = (strUserID) => {
//   players.find((obj) => (obj.lID = strUserID));

// };
module.exports.getPlayer = (strUserID) => {
  return players.find((obj) => (obj.lID = strUserID)) || false;
};

module.exports.verifyUser = (strIdentity) => {
  if (users.length == 0) return false;
  let user =
    users[
      users.map((obj, idx) => {
        if (obj.UID == strIdentity) return idx;
      })
    ];

  if (user == undefined) return false;

  return user;
};
module.exports.checkPlayerNameAvailable = (strPlayerName) => {
  if (players.find((obj) => obj.strName == strPlayerName)) {
    console.log('Player name taken:', strPlayerName);
    return false;
  }
  return true;
};

module.exports.createPlayer = (playerName, lAvatarID) => {
  let player = new Player({
    lID: players.length + 1,
    startingHP: this.config.nPlayerBaseHP,
    strName: playerName,
    lAvatarID,
    lStartingWealth: this.config.lStartingWealth,
  });
  this.addPlayer(player);

  return player;
};
module.exports.addPlayer = (player) => {
  // player.setListener(this) not necessary
  players.push(player);
};
module.exports.createAccount = (strIdentity, strPlayerName, lAvatarID) => {
  let playerName = helperFunctions.sanitizeName(strPlayerName);

  let player = this.createPlayer(playerName, lAvatarID);
  let user = new User({ strIMEI: strIdentity, lPlayerID: player.GetID() });
  player.SetUser(user);
  console.log(player);
  users.push(user);
  //   CreateEvent(new LaunchEvent(String.format("Give a warm, explosive welcome to %s, who has joined the Game!", player.GetName()), SoundEffect.RESPAWN));
  //   CreateReport(new LaunchReport(String.format("Give a warm, explosive welcome to %s, who has joined the Game!", player.GetName()), false, player.GetID()));

  return user;
};

module.exports.entityChanged = (entity, bOwner) => {
  if (!bOwner == null) {
    comms.entityUpdated(entity, bOwner);
    return;
  }
  comms.allianceUpdated(entity, false);
};

module.exports.addUser = (user) => {
  users.push(user);
};
