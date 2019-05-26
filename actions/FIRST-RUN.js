((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;
    console.log(' INITIALIZING DATA SET '.bgWhite.blue);
    // grab full dataset (second in every year's price)
    // store in stateMachine

    // put in setState('BTC-USD-PRICES-YEAR', btcUsdPricesArray)
    // set the intial avgs

    setTimeout(() => {
      setState('BTC-USD-PRICES-YEAR', new Array(60 * 60 * 24 * 366));
      const averages = {
        oneHrAvg: '',
        thirtyMinAvg: '',
        fiveMinAvg: '',
        oneMinAvg: '',
        thirtySecondAvg: '',
        lastFiveAvg: ''
      };
      setState('CURRENT-BTC-USD-AVERAGES', averages);
      console.log(' DATA SET IS HYRDRATED - STARTING LOOP '.bgWhite.blue);
      actionMachine.setReadyToStart();
      done();
    }, 2000)
  };

})(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
