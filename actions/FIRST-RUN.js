(({ actionMachine, stateMachine, utils, playSoundInstant }) => {
  const { getState, setState } = stateMachine;
  const { friendlyAlert, actionsError, generateVelocitiesArrayFromCandles } = utils;

  function handleError (err) {
    actionsError('FIRST-RUN', err);
  }

  module.exports = (params, done) => {
    const { setReadyToStart, addToActionQueue } = actionMachine;

    try {
      friendlyAlert(' INITIALIZING DATA SET ');

      const instrumentsArray = getState('OANDA-AVAILABLE-INSTRUMENTS');

      instrumentsArray.forEach(({ name }) => {
        addToActionQueue('INSTANT', { name: 'INITIALIZE-INSTRUMENT', params: { name } });
      });
      done();
    } catch (err) {
      handleError(err);
      done();
    }
  };

})(
  require('../services')
);
