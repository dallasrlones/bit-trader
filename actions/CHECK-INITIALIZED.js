(({ stateMachine, utils, soundService, errorHandlers }) => {
  const { getState, setState } = stateMachine;
  const { friendlyAlert } = utils;
  const { playSound, addToSoundQueue } = soundService;
  const { actionsError } = errorHandlers;

  function handleError(err) {
    actionsError('CHECK-INITIALIZED', err);
  }

  module.exports = ({ name }, done) => {

    try {
      if (getState('OANDA-AVAILABLE-INSTRUMENTS') !== undefined) {
        let newStates = getState('OANDA-INITIALIZED-STATES');
        newStates[name] = true;
        setState('OANDA-INITIALIZED-STATES', newStates);

        friendlyAlert(` ${name} - HYDRATED - ${Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length} / ${getState('OANDA-AVAILABLE-INSTRUMENTS').length}`);

        playSound('smallBeep.mp3');

        if (getState('OANDA-AVAILABLE-INSTRUMENTS').length === Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length) {
          friendlyAlert(' HISTORY HYDRATED ');
          addToSoundQueue('data_set_hydrated.mp3', () => {
            friendlyAlert(' UPDATING TO CURRENT CANDLES ');
            addToSoundQueue('updating_to_current.mp3', () => {
              friendlyAlert(' FULLY HYDRATED ');
              addToSoundQueue('candles_up_to_date.mp3', () => {
                friendlyAlert(' CHECKING FOR PROFIT LOSS AND POSSIBLE TRADES ');
                addToSoundQueue('initialized.mp3');
              });
            });
          });
          
          setState('OANDA-HYDRATED', true);
        }
      }

      done();
    } catch (err) {
      handleError(err);
      done();
    }

  };

})
(
  require('../services')
);
