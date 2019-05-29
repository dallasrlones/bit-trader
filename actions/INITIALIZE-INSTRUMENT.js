(({ stateMachine, actionMachine, traderMachine, utils }, moment) => {
  const { getState, setState } = stateMachine;
  const { actionsError, friendlyAlert } = utils;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
  }

  module.exports = ({ name }, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      // 900 seconds
      const startDate = (60 * 15);
      // start date divided by 5 second intervals devided by 5k max limit on API call
      const itterations = Math.ceil(startDate / 5 / 5000);

      // friendlyAlert(` SETTING - ${name} - COUNT `);
      setState(`INITIALIZING-${name}-COUNT`, itterations);

      if (itterations > 1) {
        for (var i = 0; i <= itterations; i++) {
          const fromDate = moment().subtract((i + 1) * itterations, 'seconds').unix();
          addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate }, hasAjax: true });
        }
      } else {
        const fromDate = moment().subtract(startDate, 'seconds').unix();
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
