((actionMachine, { stateMachine }) => {
  const { getState, setState } = stateMachine;
  const { setReadyToStart } = actionMachine;

  module.exports = (params, done) => {
    console.log(' INITIALIZING DATA SET '.bgWhite.blue);
    // grab full dataset (second in every year's price)
    // store in stateMachine

    // put in setState('BTC-USD-PRICES-YEAR', btcUsdPricesArray)
    //

    setTimeout(() => {
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
