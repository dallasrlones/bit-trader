(({ stateMachine, actionMachine, utils, playSound, playSoundInstant }) => {
  const { getState, setState } = stateMachine;
  const { actionsError, friendlyAlert } = utils;


  function handleError(err) {
    actionsError('CHECK-INITIALIZED', err);
  }

  module.exports = ({ name }, done) => {
    const { setReadyToStart, readyToStart } = actionMachine;

    try {
      if (readyToStart() === false) {
        let newStates = getState('OANDA-INITIALIZED-STATES');
        newStates[name] = true;
        setState('OANDA-INITIALIZED-STATES', newStates);

        friendlyAlert(` ${name} - HYDRATED - ${Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length} / ${getState('OANDA-AVAILABLE-INSTRUMENTS').length}`);

        playSound('smallBeep.mp3');

        if (getState('OANDA-AVAILABLE-INSTRUMENTS').length === Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length) {
          friendlyAlert(' HISTORY HYDRATED ');
          playSoundInstant('data_set_hydrated.mp3', () => {
            friendlyAlert(' UPDATING TO CURRENT CANDLES ');
            playSoundInstant('updating_to_current.mp3', () => {
              friendlyAlert(' FULLY HYDRATED ');
              playSoundInstant('candles_up_to_date.mp3', () => {
                friendlyAlert(' CHECKING FOR PROFIT LOSS AND POSSIBLE TRADES ');
                playSoundInstant('initialized.mp3', () => {
                  playSoundInstant('init_ai.mp3');
                  setState('OANDA-HYDRATED', true);
                });
              });
            });
          });
          setReadyToStart();
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
