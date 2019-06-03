((actionMachine, { stateMachine, soundService, utils: { friendlyAlert, alert } }, { instantQueue, fetchQueue }, {  }) => {
  const { getState } = stateMachine;
  const { addToActionQueue } = actionMachine;
  const { startInstantQueue } = instantQueue;
  const { startFetchQueue } = fetchQueue;
  const { addToSoundQueue } = soundService;

  const retrySpeed = 1000;
  const fetchQueueIntervalSpeed = 200;
  const instantQueueLoopIntervalSpeed = 50;

  function start() {
    if (getState('OANDA-ACCOUNT-PRIMARY-ID') === undefined) {
      setTimeout(() => {
        return start();
      }, 1);

    } else {
      if (getState('OANDA-AVAILABLE-INSTRUMENTS') === undefined) {
        addToActionQueue('INSTANT', { name: 'UPDATE-AVAILABLE-INSTRUMENTS', hasAjax: true });
        setTimeout(() => {
          startFetchQueue(fetchQueueIntervalSpeed);
          setTimeout(() => {
            addToActionQueue('FETCH', { name: 'UPDATE-CANDLE-DATA' });
          }, 1000);
        }, 2000);
      }
    }
  }

  // run algo to see if there is a relationship between different instruments and time
  // (at 8:00:01 am EUR went UP and GBP went down) by X amount

  addToSoundQueue('start.mp3');
  friendlyAlert(' WAKING UP ');
  addToActionQueue('INSTANT', { name: 'FETCH-ACCOUNT-ID', hasAjax: true });
  startInstantQueue(instantQueueLoopIntervalSpeed);
  start();

})(require('./services/actionMachine'), require('./services'), require('./queues'), require('./config'));
