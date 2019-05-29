(({ stateMachine, actionMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { actionsError, friendlyAlert } = utils;


  function handleError(err) {
    actionsError('CHECK-INITIALIZED', err);
  }

  module.exports = ({ name }, done) => {
    const { setReadyToStart } = actionMachine;

    try {
      console.log(` ${name} - HYDRATED - ${Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length + 1} / ${getState('OANDA-AVAILABLE-INSTRUMENTS').length}`);
      let newStates = getState('OANDA-INITIALIZED-STATES');
      newStates[name] = true;
      setState('OANDA-INITIALIZED-STATES', newStates);

      if (getState('OANDA-AVAILABLE-INSTRUMENTS').length === Object.keys(getState('OANDA-INITIALIZED-STATES') || { }).length) {
        friendlyAlert(' FULLY HYDRATED ');
        setReadyToStart();
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
