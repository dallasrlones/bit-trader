(({ actionMachine, stateMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const currentPrice = getState('CURRENT-BTC-USD-PRICE');
      const currentAvgs = getState('CURRENT-BTC-USD-AVERAGES');
      const {
        oneHrAvg,
        thirtyMinAvg,
        fiveMinAvg,
        oneMinAvg,
        thirtySecondAvg,
        lastFiveAvg
      } = currentAvgs;

      const lastFiveIsSurging = currentPrice >= (lastFiveAvg * 4)
      const lastThirtySecondsIsSurging = currentPrice >= (thirtySecondAvg * 3);
      const oneMinIsSurging = currentPrice >= (oneMinAvg * 2);

      const algo = getState('BTC-USD-ALGO-BUY') || (lastFiveIsSurging && lastThirtySecondsIsSurging && oneMinIsSurging);

      if (algo) {
        addToActionQueue('INSTANT', { name: 'BUY-BTC-USD', params: { currentAvgs, currentPrice } });
      }

      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
  require('colors')
);
