(({ stateMachine, actionMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-BALANCES', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const { btcBalance, usdBalance } = getState('COIN-BASE-CURRENT-BALANCE-BTC-USD');
      const isProfitable = getState('BTC-USD-IS-PROFITABLE');

      if (usdBalance > 0 && isProfitable === true) {
        addToActionQueue('INSTANT', { name: 'BUY-BTC-USD' });
      }

      done();
    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
