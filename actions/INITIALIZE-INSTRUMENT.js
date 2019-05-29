(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError, friendlyAlert } = utils;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
  }

  module.exports = ({ name }, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      // 900 seconds
      const timeBack = (1000 * 60 * 15) + 5000;
      // start date divided by 5 second intervals devided by 5k max limit on API call
      const itterations = Math.ceil(timeBack / 5000 / 5000);

      // friendlyAlert(` SETTING - ${name} - COUNT `);
      setState(`INITIALIZING-${name}-COUNT`, itterations);

      if (itterations > 1) {
        for (var i = 0; i <= itterations; i++) {
          const fromDate = new Date(new Date().getTime() - (i + 1) / itterations).toISOString();
          addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate }, hasAjax: true });
        }
      } else {
        const fromDate = new Date(
          new Date(new Date().toLocaleString("en-US", {timeZone: "America/Denver"})) - timeBack
        ).toISOString()
        addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate, limit: (timeBack / 1000 / 5) }, hasAjax: true });
      }
      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
