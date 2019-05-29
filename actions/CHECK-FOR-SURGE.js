(({ actionMachine, stateMachine, utils }) => {
  const { getState, getInstrumentAvgs } = stateMachine;
  const { actionsError, algo } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {

        const avgsArray = getInstrumentAvgs(name);

        if (avgsArray.length && avgsArray.length > 0) {
          if (algo(avgsArray) === true) {
            //addToActionQueue('INSTANT', { name: 'BUY-BTC-USD', params: { currentAvgs, currentPrice }, hasAjax: true });
            console.log('BUY - ' + name);
          }

        }
      });

      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
  require('colors')
);
