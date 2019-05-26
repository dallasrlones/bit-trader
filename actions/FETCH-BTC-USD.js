((actionMachine, { stateMachine, coinBaseClient }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;
    // set currentAvgs
    try {
      // fetch current price from coinBaseClient
      const currentPrice = 1.0;
      setState('CURRENT-BTC-USD-PRICE', currentPrice);

      const pushedAndPoppedPrices = getState('BTC-USD-PRICES-YEAR');
      pushedAndPoppedPrices.unshift(currentPrice);
      pushedAndPoppedPrices.pop();

      setState('BTC-USD-PRICES-YEAR', pushedAndPoppedPrices);
      addToActionQueue('FETCH-PRICES', { name: 'SET-BTC-USD-AVERAGES' });

      done();
    } catch (err) {
      console.log(`${'actions'.green}/CHECK-FOR-PROFIT-LOSS.js - ${err.toString().red}`);
      console.log(err);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
