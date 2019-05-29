(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState, addToInstrumentCandles } = stateMachine;
  const { fetchTickDataFrom } = traderMachine;
  const { actionsError, friendlyAlert } = utils;


  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT-SHARD', err);
  }

  module.exports = ({ name, fromDate }, done, retry) => {
    const { addToActionQueue } = actionMachine;

    try {
      fetchTickDataFrom('OANDA', name, fromDate, 5000)
        .then((candlesArray) => {
          setState(`INITIALIZING-${name}-COUNT`, (getState(`INITIALIZING-${name}-COUNT`) - 1));

          addToInstrumentCandles(name, candlesArray);

          if (getState(`INITIALIZING-${name}-COUNT`) === 0) {
            addToActionQueue('INSTANT', { name: 'CHECK-INITIALIZED', params: { name } });
          }

          done();
        })
        .catch(handleError);

    } catch (err) {
      handleError(err);
      retry();
    }
  };

})
(
  require('../services')
);
