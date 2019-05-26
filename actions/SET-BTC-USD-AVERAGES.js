(({ stateMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    try {
      const fullYearsTicksInSeconds = getState('BTC-USD-PRICES-YEAR');

      //console.log(fullYearsTicksInSeconds);

      // change averages
      const average = arr => arr.reduce( ( p, c ) => parseFloat(p) + parseFloat(c), 0 ) / arr.length;

      const averages = {
        dayAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60 * 24))),
        twelveHrAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60 * 12))),
        sixHrAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60 * 6))),
        threeHrAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60 * 3))),
        twoHrAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60 * 2))),
        oneHrAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 60))),
        thirtyMinAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 30))),
        fifteenMinAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 15))),
        fiveMinAvg: average(fullYearsTicksInSeconds.slice(0, (60 * 5))),
        oneMinAvg: average(fullYearsTicksInSeconds.slice(0, 60)),
        thirtySecondAvg: average(fullYearsTicksInSeconds.slice(0, 30)),
        lastFiveAvg: average(fullYearsTicksInSeconds.slice(0, 5)),
      };

      // console.log('setting avgs'.bgWhite.blue, fullYearsTicksInSeconds.length);
      // console.log(averages);
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
