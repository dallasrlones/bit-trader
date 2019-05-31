(({ stateMachine, actionMachine, utils, playSound }) => {
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

        console.log(` ${name} - HYDRATED - ${Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length} / ${getState('OANDA-AVAILABLE-INSTRUMENTS').length}`);

        playSound('smallBeep.mp3');

        if (getState('OANDA-AVAILABLE-INSTRUMENTS').length === Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length) {
          friendlyAlert(' FULLY HYDRATED ');
          playSound('transferDataComplete.mp3');
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
