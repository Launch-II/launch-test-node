module.exports = {
  name: 'TestCommand',
  desc: '',
  execute(context, { smokeSignal, gameSimulation, data }) {
    console.log('Command being handled, data', data);
    context.SendMessage({
      name: 'TestCommand',
      type: 'Command',
      data: { message: 'ballgag!' },
    });
    return;
  },
};
