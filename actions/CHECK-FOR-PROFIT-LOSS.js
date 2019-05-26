((actionMachine, { stateMachine }) => {

  module.exports = (params, done) => {
    const { getState, setState } = stateMachine;
    const { addToActionQueue } = actionMachine;

    try {

      done();
    } catch (err) {
      console.log(`${'actions'.green}/CHECK-FOR-PROFIT-LOSS.js - ${err.toString().red}`);
    }
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
