(({ stateMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    try {
      const fullYearsTicksInSeconds = getState('BTC-USD-PRICES-YEAR');

      const averages = {
        oneHrAvg: '',
        thirtyMinAvg: '',
        fiveMinAvg: '',
        oneMinAvg: '',
        thirtySecondAvg: '',
        lastFiveAvg: ''
      };

      // change averages
      for(var i in fullYearsTicksInSeconds) {
        if (i <= 5) {

        }


      }

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
