(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-PROFIT-LOSS', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;
    try {

      // grab all orders
      // loop through each one to see if profitable
      // if needs to sell add to instant queue

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
