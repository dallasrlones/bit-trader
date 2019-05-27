(({ stateMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { generateAverages, actionsError } = utils;

  function handleError(err) {
    actionsError('SET-BTC-USD-AVERAGES', err);
  }

  module.exports = (params, done) => {

    try {
      const fullYearsTicksInSeconds = getState('BTC-USD-PRICES-YEAR');
      const averages = generateAverages(fullYearsTicksInSeconds);
      // console.log('setting avgs'.bgWhite.blue, fullYearsTicksInSeconds.length);
      // console.log(averages);
      setState('CURRENT-BTC-USD-AVERAGES', averages);
      done();
    } catch (err) {
      handleError(err)
    }
  };

})
(
  require('../services')
);
