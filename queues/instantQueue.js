((instantQueue, { stateMachine, actionMachine, utils, soundService }) => {
  const { getState, setState } = stateMachine;
  const { runActionQueue, addToActionQueue } = actionMachine;
  const { warning } = utils;
  const { runSoundQueue, addToSoundQueueTop } = soundService;

  let instantQueueLoop = false;
  let tradingOpenPlayed = false;

  function dayIs(dayNum) {
    return (new Date(
      new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    ).getDay() === dayNum)
  }

  function timePassedClose(){
    return (new Date(
      new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    ).getHours() >= 17);
  }

  function isTradingOpen() {
    if ((dayIs(0) || (dayIs(5) ) || dayIs(6)) && timePassedClose() === false) {
      if(tradingOpenPlayed === false) {
        tradingOpenPlayed = true;
        setState('MARKET-IS-OPEN', false);
        addToSoundQueueTop('market_closed.mp3');
        warning('MARKET IS CLOSED');
      }
    } else {
      if (tradingOpenPlayed === true) {
        tradingOpenPlayed = false;
        setState('MARKET-IS-OPEN', true);
        addToSoundQueueTop('market_open.mp3');
      }
    }
  }

  instantQueue.startInstantQueue = (instantQueueLoopIntervalSpeed) => {
    instantQueueLoop = setInterval(() => {
      runSoundQueue();
      isTradingOpen();
      if (getState('OANDA-ACCOUNT-PRIMARY') !== undefined) {
        addToActionQueue('INSTANT', { name: 'CHECK-FOR-PROFIT-LOSS' });

        if (getState('OANDA-HYDRATED')) {
          addToActionQueue('INSTANT', { name: 'UPDATE-AVERAGES' });
          addToActionQueue('INSTANT', { name: 'CHECK-FOR-SURGE' });
        }
      }

      runActionQueue('INSTANT');
    }, instantQueueLoopIntervalSpeed);
  };

  instantQueue.stopInstantQueue = () => {
    clearInterval(instantQueueLoop);
  };

  module.exports = instantQueue;
})
(
  { },
  require('../services')
)
