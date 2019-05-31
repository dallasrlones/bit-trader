(({ actionMachine, stateMachine, traderMachine, utils, playSound }) => {
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
    const { addToActionQueue } = actionMachine;
    // top 5 surging currency pairs
    setState('OANDA-TOP-SURGING', []);
    // { 'USD_BTC': true, ... }
    setState('OANDA-CURRENCY-IS-PROFITABLE', { });

    setState('OANDA-INITIALIZED-STATES', { });

    // grab accounts ids
    playSound('diagnosticUnderway.mp3');

    friendlyAlert(' FETCHING ACCOUNTS ')
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
                    setState('OANDA-AVAILABLE-INSTRUMENTS', instrumentsArray);
                    addToActionQueue('INSTANT', { name: 'UPDATE-CURRENT-PRICES', hasAjax: true });
                    friendlyAlert(' INSTRUMENTS SYNCED ');
                    let count = instrumentsArray.length;
                    friendlyAlert(` INITIALIZING - ${count} - INSTRUMENTS`);
                    instrumentsArray.forEach(({ name }) => {
                      addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT', params: { name } });
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
  require('../services')
);
