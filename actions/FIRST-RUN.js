(({ actionMachine, stateMachine, traderMachine, utils }, moment) => {
  const { getState, setState } = stateMachine;
  const {
    fetchAccountIds,
    fetchAccountById,
    fetchCurrentOrders,
    fetchTickDataFrom,
    fetchAvailableInstruments
  } = traderMachine;
  const { friendlyAlert, actionsError, generateVelocitiesArrayFromCandles } = utils;

  function handleError (err) {
    actionsError('FIRST-RUN', err);
    process.exit(1)
  }

  function oandaLoop(setReadyToStart) {
    // top 5 surging currency pairs
    setState('OANDA-TOP-SURGING', []);
    // { 'USD_BTC': true, ... }
    setState('OANDA-CURRENCY-IS-PROFITABLE', { });

    // grab accounts ids
    fetchAccountIds('OANDA')
      .then((accountIdsArray) => {

        accountIdsArray.forEach(({ id }) => {
          // is primary account, set ID in stateMachine
          // CHECK TO SEE IF 001 IS YOUR PRIMARY ACCOUNT
          if (id.slice((id.length - 3), id.length) === '001') {
            setState('OANDA-ACCOUNT-PRIMARY-ID', id);

            fetchAccountById('OANDA', id)
              .then((primaryAccount) => {
                friendlyAlert(' ACCOUNT SYNCED ');
                // set primary account data in stateMachine
                setState('OANDA-ACCOUNT-PRIMARY', primaryAccount);

                // console.log(primaryAccount);

                //grab available instruments
                fetchAvailableInstruments('OANDA', id)
                  .then((instrumentsArray) => {
                    friendlyAlert(' INSTRUMENTS SYNCED ');
                    let count = instrumentsArray.length;
                    friendlyAlert(` LOOPING THROUGH - ${count} - INSTRUMENTS`);
                    instrumentsArray.forEach(({ name }) => {

                      // FETCH MONTHS TICK DATA
                      const secondsInAMonth = (60 * 60 * 24 * 28);


                      // loop through seconds in a month / 5000 for all itteration counts
                      let fetchCount = secondsInAMonth / 5000 / 5;

                      console.log(fetchCount);
                      process.exit(1)

                      for (var i = 1; i < secondsInAMonth / 5000 / 5; i++) {

                        const dateToStep = moment().subtract(i * 5000, 'seconds').unix();

                        fetchTickDataFrom('OANDA', name, dateToStep, 5000)
                          .then((candlesArray) => {

                            // if this is too big for ram put in a graph db
                            // setState(`OANDA-CANDLE-DATA-MONTH-${name}`, candlesArray);
                            // setState(`OANDA-CANDLE-AVERAGES-${name}`, generateVelocitiesArrayFromCandles(candlesArray));

                            fetchCount -= 1;

                            friendlyAlert(` ITTERATIONS LEFT - ${count} `);

                            if (fetchCount <= 0) {
                              count -= 1;

                              if (count >= 0) {
                                friendlyAlert(' DATA SET IS HYRDRATED - STARTING LOOP ');
                                actionMachine.setReadyToStart();
                                done();
                              }

                            }
                          })
                          .catch(handleError);

                      }


                    });

                  })
                  .catch(handleError);

              })
              .catch(handleError);
          }
        });
      })
      .catch(handleError);

  }

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;

    friendlyAlert(' INITIALIZING DATA SET ');
    oandaLoop(setReadyToStart);
  };

})(
  require('../services'),
  require('moment')
);
