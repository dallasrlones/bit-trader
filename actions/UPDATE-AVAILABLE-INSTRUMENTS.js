(({ stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchAvailableInstruments } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('UPDATE-AVAILABLE-INSTRUMENTS', err);
  }

  module.exports = (params, done, retry) => {
    try {

      fetchAvailableInstruments('OANDA', getState('OANDA-ACCOUNT-PRIMARY-ID'))
        .then((instruments) => {
          setState('OANDA-AVAILABLE-INSTRUMENTS', instruments);
          done();
        })
        .catch(err => {
          handleError(err);
          retry();
        });

    } catch (err) {
      handleError(err);
      done();
    }
  };

})
(
  require('../services')
);
