(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState, addToInstrumentCandles } = stateMachine;
  const { fetchTickDataFrom } = traderMachine;
  const { actionsError, friendlyAlert } = utils;


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
            handleError('candles array not the limit length');
            console.log(candlesArray.length);
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
