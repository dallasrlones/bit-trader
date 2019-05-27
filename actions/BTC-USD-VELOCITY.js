(({ stateMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('BTC-USD-VELOCITY', err);
  }

  module.exports = (params, done) => {
    try {
      const { lastFiveAvg, fiveMinAvg } = getState('CURRENT-BTC-USD-AVERAGES');
      const positiveCheck = lastFiveAvg > fiveMinAvg ? true : false;

      setState('BTC-USD-IS-PROFITABLE', positiveCheck);
      done();
    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
