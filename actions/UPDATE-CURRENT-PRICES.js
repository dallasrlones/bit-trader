(({ stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchCurrentPricingForInstruments } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('UPDATE-CURRENT-PRICES', err);
  }

  module.exports = (params, done, retry) => {

    try {

      // fetch prices and store in state

    } catch (err) {
      handleError(err);
      retry();
    }

  };

})
(
  require('../services')
);
