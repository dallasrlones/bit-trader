(({ stateMachine, actionMachine, traderMachine, utils, errorHandlers }) => {
  const { getState, setState, addToInstrumentCandles } = stateMachine;
  const { fetchTickDataFrom } = traderMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;

  module.exports = ({ name, fromDate, itteration, limit }, done, retry) => {
    function handleError(err) {
      actionsError('INITIALIZE-INSTRUMENT-SHARD', err);
      // REMOVE
      process.exit(1337);
      retry();
    }

    const { addToActionQueue } = actionMachine;

    try {
      fetchTickDataFrom('OANDA', name, fromDate, limit || 5000)
        .then((candlesArray) => {
          if (candlesArray.length !== limit) {
            handleError('response candles array not the requested limit length');
          }

          addToInstrumentCandles(name, itteration, candlesArray);
          setState(`INITIALIZING-${name}-COUNT`, (getState(`INITIALIZING-${name}-COUNT`) - 1));

          if (getState(`INITIALIZING-${name}-COUNT`) === 0) {
            addToActionQueue('INSTANT', { name: 'CHECK-INITIALIZED', params: { name } });
          }

          done();
        })
        .catch((err) => {
          setState(`INITIALIZING-${name}-COUNT`, (getState(`INITIALIZING-${name}-COUNT`) + 1));
          handleError(err);
        });

    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
