(({ stateMachine, actionMachine, traderMachine, utils }, moment) => {
  const { getState, setState } = stateMachine;
  const { actionsError, friendlyAlert } = utils;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
  }

  module.exports = ({ name }, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const fifteenMinutesInSeconds = (60 * 15);
      const itterations = Math.ceil(fifteenMinutesInSeconds / 5 / 5000);

      // friendlyAlert(` SETTING - ${name} - COUNT `);
      setState(`INITIALIZING-${name}-COUNT`, itterations);

      for (var i = 0; i < itterations; i++) {
        const fromDate = moment().subtract((i + 1) * itterations, 'seconds').unix();
        addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate }, hasAjax: true });
      }
      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
  require('moment')
);
