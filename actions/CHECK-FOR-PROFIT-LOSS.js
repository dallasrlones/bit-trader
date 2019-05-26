((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;
    try {

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
