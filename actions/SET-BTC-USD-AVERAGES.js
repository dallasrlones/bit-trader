(({ stateMachine }) => {

  module.exports = (params, done) => {
    const { getState, setState } = stateMachine;
    // set currentAvgs
    try {

      const currentPrice = getState('CURRENT-BTC-USD-PRICE');

      // set averages as well as remove the old averages that are out of the time frame
      const averages = {
        oneHrAvg: '',
        thirtyMinAvg: '',
        fiveMinAvg: '',
        oneMinAvg: '',
        thirtySecondAvg: '',
        lastFiveAvg: ''
      };
      setState('CURRENT-BTC-USD-AVERAGES', averages);

      done();
    } catch (err) {
      console.log(`${'actions'.green}/SET-BTC-USD-AVERAGES.js - ${err.toString().red}`);
    }
  };

})
(
  require('../services')
);
