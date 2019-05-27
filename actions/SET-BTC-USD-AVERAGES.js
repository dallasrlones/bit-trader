(({ stateMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { generateAverages } = utils;

  module.exports = (params, done) => {
    try {
      const fullYearsTicksInSeconds = getState('BTC-USD-PRICES-YEAR');

      const averages = generateAverages(fullYearsTicksInSeconds);

      console.log('setting avgs'.bgWhite.blue, fullYearsTicksInSeconds.length);
      console.log(averages);
      setState('CURRENT-BTC-USD-AVERAGES', averages);

      done();
    } catch (err) {
      console.log(`${'actions'.green}/SET-BTC-USD-AVERAGES.js - ${err.toString().red}`);
      console.log(err);
    }
  };

})
(
  require('../services')
);
