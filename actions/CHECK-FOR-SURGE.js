(({ actionMachine, stateMachine, utils }) => {
  const { getState, setState, getInstrumentCandles } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {

      // get last 5 mins
      // if now is 3x last 5 avgs its in surge
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {

        const candlesArray = getInstrumentCandles(name);



      });

      // if (algo) {
      //   addToActionQueue('INSTANT', { name: 'BUY-BTC-USD', params: { currentAvgs, currentPrice } });
      // }

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
