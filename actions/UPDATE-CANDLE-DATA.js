(({ actionMachine, stateMachine, utils, soundService, errorHandlers }) => {
  const { getState, setState } = stateMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;
  const { addToSoundQueue } = soundService;

  function handleError (err) {
    actionsError('UPDATE-CANDLE-DATA', err);
  }

  module.exports = (params, done) => {
    const { setReadyToStart, addToActionQueue } = actionMachine;

    try {
      addToSoundQueue('init.mp3');
      friendlyAlert(' INITIALIZING CANDLES DATA SET ');
      setState('OANDA-INITIALIZED-STATES', {});

      const instrumentsArray = getState('OANDA-AVAILABLE-INSTRUMENTS');

      instrumentsArray.forEach(({ name }) => {
        // getState(customcandles) [length] time - 200 milliseconds (fetch loop time)
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
