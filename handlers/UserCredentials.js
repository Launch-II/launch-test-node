module.exports = {
  name: 'UserCredentials',
  desc: '',
  requiresAuth: false,
  requiresPlayer: false,
  execute(context, { smokeSignal, gameSimulation, data }) {
    let banned = false;
    console.log('Authenticating! data:', data);
    let user = gameSimulation.verifyUser(data.data.uid);
    if (user) {
      user.SetLastNetwork(context.strIPAddress);
      if (!banned) {
        let player = gameSimulation.getPlayer(user.lPlayerID);
        context.player = player;
        context.bRegistered = true;
        context.AuthenticatedUser = user;

        context.SendMessage({
          name: 'AuthorizationSuccess',
          type: 'entity',
          data: user,
        });
      }
    } else {
      context.SendMessage({
        name: 'AccountUnregistered',
        type: 'Command',
      });
    }
    return;
  },
};
