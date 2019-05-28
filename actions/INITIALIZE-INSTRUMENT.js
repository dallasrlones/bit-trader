(({ stateMachine, actionMachine, traderMachine, utils }, moment) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
  }

  module.exports = ({ name }, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const secondsInAMonth = (60 * 60 * 24 * 28);
      const itterations = Math.ceil(secondsInAMonth / 5000 / 5);
      setState(`INITIALIZING-${name}-COUNT`, itterations);

      for (var i = 1; i < itterations; i++) {
        const fromDate = moment().subtract(i * itterations, 'seconds').unix();
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
