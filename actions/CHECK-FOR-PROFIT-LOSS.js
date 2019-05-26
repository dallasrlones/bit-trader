((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;
    try {

      // grab all orders
      // loop through each one to see if profitable
      // if needs to sell add to instant queue

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
