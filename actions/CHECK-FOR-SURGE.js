(({ actionMachine, stateMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {

      

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
