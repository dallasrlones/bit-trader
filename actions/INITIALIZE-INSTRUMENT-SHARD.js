(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
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

          // console.log(getState(`INITIALIZING-${name}-COUNT`));

          if (getState(`INITIALIZING-${name}-COUNT`) === 1) {
            // console.log(` ${name} - HYDRATED `);
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
