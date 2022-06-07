// import Player from '../LaunchGame/game/entities/Player';
const { Player } = require('../LaunchGame/game/entities/Player');
module.exports = {
  name: 'CreatePlayer',
  desc: '',
  requiresAuth: true,
  requiresPlayer: false,
  execute(context, { smokeSignal, gameSimulation, data }) {
    let player = gameSimulation.getPlayer(context.AuthenticatedUser.lPlayerId);
    // Ensure that player does not already exist for user.
    if (player) {
      context.sendMessage({
        name: 'Error',
        type: 'error',
        data: {
          message: 'A player already exists for this user!',
        },
      });
      return;
    }

    let avatarId;
    // Take base64 image, save it to a local directory, assign it an ID, return that id.

    player = new Player({
      lID: (gameSimulation?.players?.length || 0) + 1,
      startingHP: gameSimulation.config.nPlayerBaseHP,
      strName: data.playerName,
      lAvatarID: avatarId,
      lStartingWealth: gameSimulation.config.lStartingWealth,
    });

    gameSimulation.addPlayer(player);

    context.player = player;

    context.SendMessage({
      name: 'PlayerCreateSuccess',
      type: 'message',
      data: player,
    });
  },
};
