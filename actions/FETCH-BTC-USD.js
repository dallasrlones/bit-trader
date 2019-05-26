((actionMachine, { stateMachine, coinBaseClient }) => {

  module.exports = (params, done) => {
    const { getState, setState } = stateMachine;
    const { addToActionQueue } = actionMachine;
    // set currentAvgs
    try {
      // fetch current price from coinBaseClient
      const currentPrice = 1.0;
      setState('CURRENT-BTC-USD-PRICE', currentPrice);
      addToActionQueue('FETCH-PRICES', { name: 'SET-BTC-USD-AVERAGES' });
      done();
    } catch (err) {
      console.log(`${'actions'.green}/CHECK-FOR-PROFIT-LOSS.js - ${err.toString().red}`);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services')
);
