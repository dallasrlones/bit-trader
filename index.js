((actionMachine, { stateMachine, playSound, utils: { friendlyAlert, alert } }, { instantQueue, fetchQueue }, {  }) => {
  const { getState } = stateMachine;
  const { runActionQueue, addToActionQueue, readyToStart } = actionMachine;
  const { startInstantQueue } = instantQueue;
  const { startFetchQueue } = fetchQueue;

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
          addToActionQueue('FETCH', { name: 'FIRST-RUN', hasAjax: true });
          startFetchQueue(fetchQueueIntervalSpeed);
        }, 2000);
      }
    }
  }

  // run algo to see if there is a relationship between different instruments and time
  // (at 8:00:01 am EUR went UP and GBP went down) by X amount

  playSound('init.mp3');
  friendlyAlert(' INITIALIZING ');
  addToActionQueue('INSTANT', { name: 'FETCH-ACCOUNT-ID', hasAjax: true });
  startInstantQueue(instantQueueLoopIntervalSpeed);
  start();

})(require('./services/actionMachine'), require('./services'), require('./queues'), require('./config'));
