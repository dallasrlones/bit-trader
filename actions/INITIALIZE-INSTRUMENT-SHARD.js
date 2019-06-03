(({ stateMachine, actionMachine, traderMachine, utils, errorHandlers }) => {
  const { getState, setState, addToInstrumentCandles } = stateMachine;
  const { fetchTickDataFrom } = traderMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;


  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT-SHARD', err);
  }

  module.exports = ({ name, fromDate, limit }, done, retry) => {
    const { addToActionQueue } = actionMachine;

    try {
      fetchTickDataFrom('OANDA', name, fromDate, limit || 5000)
        .then((candlesArray) => {
          setState(`INITIALIZING-${name}-COUNT`, (getState(`INITIALIZING-${name}-COUNT`) - 1));

          if (candlesArray.length !== limit) {
            handleError('response candles array not the requested limit length');
            console.log(fromDate);
            console.log(name);
            console.log(limit);
            console.log(candlesArray.length);
            console.log(candlesArray);
            process.exit(1)
            retry();
          }

          addToInstrumentCandles(name, candlesArray);

          if (getState(`INITIALIZING-${name}-COUNT`) === 0) {
            addToActionQueue('INSTANT', { name: 'CHECK-INITIALIZED', params: { name } });
          }

          done();
        })
        .catch((err) => {
          setState(`INITIALIZING-${name}-COUNT`, (getState(`INITIALIZING-${name}-COUNT`) + 1));
          handleError(err);
          retry();
        });

    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
