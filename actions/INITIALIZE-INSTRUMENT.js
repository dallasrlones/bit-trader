(({ stateMachine, actionMachine, utils, errorHandlers }) => {
  const { getState, setState, getLatestCustomCandleOpenTime } = stateMachine;
  const { friendlyAlert } = utils;
  const { actionsError } = errorHandlers;

  function handleError(err) {
    actionsError('INITIALIZE-INSTRUMENT', err);
    process.exit(1337);
  }

  module.exports = ({ name }, done, retry) => {
    const { addToActionQueue } = actionMachine;

    try {
      // gets the last updated customCandleTime
      const lastTime = getLatestCustomCandleOpenTime(name);
      // if it's false this means a full custom candle hasn't been made yet
      if (lastTime === false) {
        retry();
        return;
      }

      const itterationCount = 5;
      setState(`INITIALIZING-${name}-COUNT`, itterationCount);

      // because our loop has 5 itterations per second we want 5 candle data sets
      // this allows us to go back X time depending on our current itteration in the loop
      for(var i = 0; i < itterationCount; i++) {
        const addTime = i * 200;

        const fromDate =  parseFloat(new Date(
          new Date(parseFloat(lastTime) * 1000).getTime() - 5200
        ).getTime() / 1000 + addTime).toFixed(0);

        // pass in the current i so we can add that to instrument_dataset[i]
        addToActionQueue('FETCH', {
          name: 'INITIALIZE-INSTRUMENT-SHARD',
          params: { name, fromDate, limit: 180, itteration: i },
          hasAjax: true
        });
      }

      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
