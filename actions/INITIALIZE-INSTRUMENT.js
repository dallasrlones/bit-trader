(({ stateMachine, actionMachine, utils, errorHandlers }) => {
  const { getState, setState, getLatestCustomCandleOpenTime } = stateMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
  }

  module.exports = ({ name }, done, retry) => {
    const { addToActionQueue } = actionMachine;

    try {

      // minus 200 because each pricing itteration is 200 millis
      // mins 15 mins
      const lastTime = getLatestCustomCandleOpenTime(name);
      if (lastTime === false) {
        return retry();
      }
      const fromDate =  parseFloat(lastTime - 200 - (1000 * 60 * 15));

      setState(`INITIALIZING-${name}-COUNT`, 1);
      addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate, limit: 181 }, hasAjax: true });
      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
