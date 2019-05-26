((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;

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
        addToActionQueue('PROFIT-CHECK', { name: 'BUY-BTC-USD', params: { currentAvgs, currentPrice } });
      }
      done();
    } catch (err) {
      console.log(`${'actions'.green}/CHECK-FOR-SURGE.js - ${err.toString().red}`);
      console.log(err);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
