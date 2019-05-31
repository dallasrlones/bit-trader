(({ stateMachine, actionMachine, utils }) => {
  const { getState } = stateMachine;

  function handleError(err) {
    actionsError('FETCH-ALL-CANDLES', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS') || [];

      availableInstruments.forEach(({ name }) => {
        addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT', params: { name }, hasAjax: true });
      });

      done();
    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
