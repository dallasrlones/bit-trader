((instantQueue, { stateMachine, actionMachine, utils, soundService }) => {
  const { getState, setState } = stateMachine;
  const { runActionQueue, addToActionQueue } = actionMachine;
  const { warning } = utils;
  const { runSoundQueue, addToSoundQueueTop } = soundService;

  const timeZone = 'America/New_York';
  let instantQueueLoop = false;
  let tradingOpenPlayed = false;

  function timePassedClose(){
    return (new Date(
      new Date().toLocaleString("en-US", { timeZone })
    ).getHours() >= 17);
  }

  function isTradingOpen() {
    const rightNow = new Date(
      new Date().toLocaleString("en-US", { timeZone })
    );

    const theDay = rightNow.getDay();
    const theHours = rightNow.getHours();

    if ((theDay == 5 && theHours >= 17) || theDay == 6 || (theDay == 7 && theHours <= 16)) {
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
