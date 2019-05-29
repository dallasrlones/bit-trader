(({ actionMachine, stateMachine, utils }) => {
  const { getState, setState, getInstrumentAvgs, getInstrumentPrice } = stateMachine;
  const { actionsError, algo } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {

      if (getState('OANDA-CURRENT-PRICES') === undefined) {
        done();
        return;
      }

      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {

        const avgsArray = getInstrumentAvgs(name);
        const currentPriceObj = getInstrumentPrice(name);

        if (currentPriceObj !== undefined && avgsArray.length && avgsArray > 0) {

          if (algo(currentPrice, avgsArray) === true) {
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
