(({ stateMachine, utils }) => {
  const { getState, setState, getInstrumentCandles, setInstrumentAvgs } = stateMachine;
  const { actionsError, generateInstrumentAvgs } = utils;

  function handleError(err) {
    actionsError('UPDATE-AVERAGES', err);
  }

  module.exports = (params, done) => {
    try {
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {
        setInstrumentAvgs(name, generateInstrumentAvgs(getInstrumentCandles(name)));
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
