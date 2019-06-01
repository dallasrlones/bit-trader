((actionMachine, { stateMachine, playSound }, { instantQueue, fetchQueue }) => {
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
          playSound('starting_fetch.mp3');
          addToActionQueue('FETCH', { name: 'FIRST-RUN', hasAjax: true });
          startFetchQueue(fetchQueueIntervalSpeed);
        }, 2000);
      }
    }
  }


  addToActionQueue('INSTANT', { name: 'FETCH-ACCOUNT-ID', hasAjax: true });
  startInstantQueue(instantQueueLoopIntervalSpeed);
  start();



})(require('./services/actionMachine'), require('./services'), require('./queues'));
