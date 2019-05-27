(({ stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchAccountBalance } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('FETCH-BTC-BALANCES', err);
  }

  module.exports = (params, done) => {

    try {
      fetchAccountBalance('COIN-BASE-BTC')
        .then(({ btcBalance, usdBalance }) => {
          setState('COIN-BASE-CURRENT-BALANCE-BTC-USD', { btcBalance, usdBalance });
          done();
        })
        .catch(handleError)
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
