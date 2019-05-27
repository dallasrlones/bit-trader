(({ stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { sell } = traderMachine;
  const { actionsError } = utils;

  function handleError(err){
    actionsError('SELL-BTC-USD', err);
  }

  module.exports = (params, done) => {

    try {
      const { btcBalance, usdBalance } = getState('CURRENT-BTC-BALANCE');

      sell('COIN-BASE-BTC', currentBTCBalance)
        .then((transaction) => {
          // save transaction to DB
        })
        .catch(handleError)

    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
);
