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

      const lastTime = getLatestCustomCandleOpenTime(name);
      if (lastTime === false) {
        return retry();
      }

      // minus 900 some how magically equals 15 mins
      const fromDate =  parseFloat(new Date(new Date(parseFloat(lastTime) * 1000).getTime() - 200 - (1000 * 60 * 15)).getTime() / 1000);
      //console.log(fromDate);

      setState(`INITIALIZING-${name}-COUNT`, 1);
      addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT-SHARD', params: { name, fromDate: lastTime, limit: 180 }, hasAjax: true });
      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
