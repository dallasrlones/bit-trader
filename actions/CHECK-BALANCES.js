(({ stateMachine, actionMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-BALANCES', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const { btcBalance, usdBalance } = getState();
      const currentOrders = getState();

      if (usdBalance > 0 && currentOrders.length > 0) {
        // buy more, because there are trades means that btc is going up
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
