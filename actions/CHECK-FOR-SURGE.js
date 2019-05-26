((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;
  const { addToActionQueue } = actionMachine;

  module.exports = (params, done) => {
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

      if (lastFiveIsSurging && lastThirtySecondsIsSurging && oneMinIsSurging) {
        addToActionQueue('PROFIT-CHECK', { name: 'BUY-BTC-USD', params: { currentAvgs, currentPrice } });
      }
      done();
    } catch (err) {
      console.log(`${'actions'.green}/CHECK-FOR-SURGE.js - ${err.toString().red}`);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
