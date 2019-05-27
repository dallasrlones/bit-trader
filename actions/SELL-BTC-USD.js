(({ stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { sell } = traderMachine;
  const { actionsError } = utils;

  function handleError(err){
    actionsError('SELL-BTC-USD', err);
  }

  module.exports = (params, done) => {

    try {

      // get current balance of btc

      sell('COIN-BASE', currentBTCBalance)
        .then()
        .catch(handleError)

    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
);
