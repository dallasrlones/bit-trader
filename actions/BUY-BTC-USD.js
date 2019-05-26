((actionMachine, { stateMachine }) => {
  const { setState, getState } = stateMachine;
  const { addToActionQueue } = actionMachine;

  module.exports = (params, done) => {
    try {
      // buy and then save the purchase
      let purchase = {};
      //addToActionQueue('PROFIT-CHECK', { name: 'SAVE-PURCHACE-BTC-USD', params: { purchase } });
      done();
    } catch (err) {
      console.log(`${'actions'.green}/BUY-BTC-USD.js - ${err.toString().red}`);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
