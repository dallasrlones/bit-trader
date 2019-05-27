(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const {
    fetchAccountIds,
    fetchAccountById,
    fetchCurrentOrders,
    fetchTickDataFrom
  } = traderMachine;
  const { friendlyAlert, actionsError, generateAverages } = utils;

  function handleError (err) {
    actionsError('FIRST-RUN', err);
  }

  function oandaLoop(setReadyToStart) {

    // grab accounts
    // set primary account id in stateMachine
    fetchAccountIds('OANDA')
      .then((accountIdsArray) => {
        console.log(accountIdsArray);
        process.exit(1);
      })
      .catch((err) => {
        handleError(err);
      });


    // FETCH CURRENT ORDERS
    // fetchCurrentOrders('OANDA')
    //   .then((currentOrdersArray) => {
    //     setState('COIN-BASE-CURRENT-ORDERS-BTC-USD', currentOrdersArray);
    //
    //     // FETCH CURRENT ACCOUNT BALANCE
    //     fetchAccountBalance('OANDA')
    //       .then((currentBalance) => {
    //         // currentBalance will be { usdBalance, btcBalance }
    //         setState('COIN-BASE-CURRENT-BALANCE-BTC-USD', currentBalance);
    //
    //         // FETCH YEARS WORTH OF DATA IN SECONDS
    //         fetchYearsTickData('OANDA')
    //           .then(fullYearsTicksInSeconds => {
    //             setState('BTC-USD-PRICES-YEAR', fullYearsTicksInSeconds);
    //
    //             const averages = generateAverages(fullYearsTicksInSeconds);
    //             setState('CURRENT-BTC-USD-AVERAGES', averages);
    //
    //             friendlyAlert(' DATA SET IS HYRDRATED - STARTING LOOP ');
    //
    //             actionMachine.setReadyToStart();
    //             done();
    //
    //           }).catch(handleError);
    //
    //       })
    //       .catch(handleError);
    //
    //   })
    //   .catch(handleError);
  }

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;

    friendlyAlert(' INITIALIZING DATA SET ');
    oandaLoop(setReadyToStart);
  };

})(
  require('../services')
);
