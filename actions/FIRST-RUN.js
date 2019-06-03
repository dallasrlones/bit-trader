(({ actionMachine, stateMachine, utils, soundService, errorHandlers }) => {
  const { getState } = stateMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;
  const { addToSoundQueue } = soundService;

  function handleError (err) {
    actionsError('FIRST-RUN', err);
  }

  module.exports = (params, done) => {
    const { setReadyToStart, addToActionQueue } = actionMachine;

    try {
      addToSoundQueue('init.mp3');
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
