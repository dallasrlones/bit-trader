(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchCurrentPrice } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('FETCH-BTC-USD', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      fetchCurrentPrice('COIN-BASE-BTC')
        .then((currentPrice) => {
          setState('CURRENT-BTC-USD-PRICE', currentPrice);

          const pushedAndPoppedPrices = getState('BTC-USD-PRICES-YEAR');
          pushedAndPoppedPrices.unshift(currentPrice);
          pushedAndPoppedPrices.pop();

          setState('BTC-USD-PRICES-YEAR', pushedAndPoppedPrices);
          addToActionQueue('INSTANT', { name: 'SET-BTC-USD-AVERAGES' });

          done();
        })
        .catch(handleError);

    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
