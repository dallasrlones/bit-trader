(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const {
    fetchCurrentOrders,
    fetchAccountBalance,
    fetchYearsTickData
  } = traderMachine;
  const { friendlyAlert, actionsError, generateAverages } = utils;

  function handleError (err) {
    actionsError('FIRST-RUN', err);
  }

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;

    friendlyAlert(' INITIALIZING DATA SET ');

    // FETCH CURRENT ORDERS
    fetchCurrentOrders('COIN-BASE')
      .then((currentOrdersArray) => {
        setState('COIN-BASE-CURRENT-ORDERS-BTC-USD', currentOrdersArray);

        // FETCH CURRENT ACCOUNT BALANCE
        fetchAccountBalance('COIN-BASE')
          .then((currentBalance) => {
            // currentBalance will be { usdBalance, btcBalance }
            setState('COIN-BASE-CURRENT-BALANCE-BTC-USD', currentBalance);

            // FETCH YEARS WORTH OF DATA IN SECONDS
            fetchYearsTickData('COIN-BASE')
              .then(fullYearsTicksInSeconds => {
                setState('BTC-USD-PRICES-YEAR', fullYearsTicksInSeconds);

                const averages = generateAverages(fullYearsTicksInSeconds);
                setState('CURRENT-BTC-USD-AVERAGES', averages);

                friendlyAlert(' DATA SET IS HYRDRATED - STARTING LOOP ');

                actionMachine.setReadyToStart();
                done();

              }).catch(handleError);

          })
          .catch(handleError);

      })
      .catch(handleError);
  };

})(
  require('../services')
);
