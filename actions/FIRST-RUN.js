(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchYearsTickData } = traderMachine;
  const { generateAverages } = utils;

  function handleError (err) {
    console.log(`${'actions'.green}/FIRST-RUN.js - ${err.toString().red}`);
    console.log(err);
  }

  module.exports = (params, done) => {
    const { setReadyToStart } = actionMachine;
    console.log(' INITIALIZING DATA SET '.bgWhite.blue);

    fetchYearsTickData('COIN-BASE').then(fullYearsTicksInSeconds => {
      setState('BTC-USD-PRICES-YEAR', fullYearsTicksInSeconds);

      const averages = generateAverages(fullYearsTicksInSeconds);
      setState('CURRENT-BTC-USD-AVERAGES', averages);

      console.log(' DATA SET IS HYRDRATED - STARTING LOOP '.bgWhite.blue);

      actionMachine.setReadyToStart();
      done();
    }).catch(handleError);
  };

})(
  require('../services'),
  require('colors')
);
