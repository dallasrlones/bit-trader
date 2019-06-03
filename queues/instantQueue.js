((instantQueue, { stateMachine, actionMachine, utils, playSoundInstant }) => {
  const { getState, setState } = stateMachine;
  const { runActionQueue, addToActionQueue } = actionMachine;
  const { warning } = utils;

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

        setTimeout(() => {
          playSoundInstant('market_closed.mp3');
          warning('MARKET IS CLOSED'.red);
        }, 1000 * 30);
      }
    } else {
      if (tradingOpenPlayed === true) {
        tradingOpenPlayed = false;
        setState('MARKET-IS-OPEN', true);

        setTimeout(() => {
          playSoundInstant('market_open.mp3');
        }, 1000 * 30)
      }
    }
  }

  instantQueue.startInstantQueue = (instantQueueLoopIntervalSpeed) => {
    instantQueueLoop = setInterval(() => {
      isTradingOpen();
      if (getState('OANDA-ACCOUNT-PRIMARY') !== undefined) {
        addToActionQueue('INSTANT', { name: 'CHECK-FOR-PROFIT-LOSS' });

        if (getState('OANDA-HYDRATED') !== undefined) {
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
