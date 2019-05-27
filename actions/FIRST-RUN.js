(({ actionMachine, stateMachine, traderMachine }) => {
  const { getState, setState } = stateMachine;
  const { fetchYearsTickData } = traderMachine;

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;
    console.log(' INITIALIZING DATA SET '.bgWhite.blue);
    // grab full dataset (second in every year's price)
    // store in stateMachine

    // put in setState('BTC-USD-PRICES-YEAR', btcUsdPricesArray)
    // set the intial avgs

    fetchYearsTickData('COIN-BASE').then(response => {
      setState('BTC-USD-PRICES-YEAR', response);
      const averages = {};
      setState('CURRENT-BTC-USD-AVERAGES', averages);
      console.log(' DATA SET IS HYRDRATED - STARTING LOOP '.bgWhite.blue);
      actionMachine.setReadyToStart();
      done();
    }).catch(err => {
      console.log(`${'actions'.green}/FIRST-RUN.js - ${err.toString().red}`);
      console.log(err);
    });
  };

})(
  require('../services'),
  require('colors')
);
